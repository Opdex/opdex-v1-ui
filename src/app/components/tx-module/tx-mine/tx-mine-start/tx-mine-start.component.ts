import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { OnDestroy } from '@angular/core';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, switchMap, take, distinctUntilChanged, tap, filter, map } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MiningQuote } from '@sharedModels/platform-api/requests/mining-pools/mining-quote';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';

@Component({
  selector: 'opdex-tx-mine-start',
  templateUrl: './tx-mine-start.component.html',
  styleUrls: ['./tx-mine-start.component.scss']
})
export class TxMineStartComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data;
  form: FormGroup;
  icons = Icons;
  pool: LiquidityPool;
  allowance$ = new Subscription();
  transactionTypes = AllowanceRequiredTransactionTypes;
  fiatValue: FixedDecimal;
  allowance: AllowanceValidation;
  allowanceTransaction$ = new Subscription();
  latestSyncedBlock$: Subscription;
  percentageSelected: string;
  balanceError: boolean;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get percentageOfSupply() {
    const oneHundred = FixedDecimal.OneHundred(8);
    const { miningPool, tokens } = this.pool;
    const inputWeight = new FixedDecimal(this.amount.value, tokens.lp.decimals);
    if (miningPool.tokensMining.isZero) return oneHundred;
    return inputWeight.divide(miningPool.tokensMining).multiply(oneHundred);
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    protected _injector: Injector,
    private _env: EnvironmentsService
  ) {
    super(_injector);

    this.form = this._fb.group({
      amount: [null, [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]]
    });

    this.allowance$ = this.amount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map(amount => {
          const amountFixed = new FixedDecimal(amount || '0', this.pool.tokens.lp.decimals);
          amountFixed.isZero ? this.reset() : this.setFiatValue(amountFixed);
          return amountFixed;
        }),
        filter(amount => !!this.context?.wallet && amount.bigInt > 0),
        switchMap(amount => this.getAllowance$(amount.formattedValue)),
        switchMap(_ => this.validateBalance()))
      .subscribe();

    this.latestSyncedBlock$ = this._indexService.latestBlock$
      .pipe(
        filter(_ => !!this.context.wallet),
        switchMap(_ => this.getAllowance$()))
      .subscribe();
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
    this.reset();
  }

  submit(): void {
    // Temporary
    const walletConflicts = this._env.prevention.wallets.includes(this.context.wallet);
    const poolConflicts = this._env.prevention.pools.includes(this.pool.address);

    if (walletConflicts || poolConflicts) {
      this.quoteErrors = ['Unexpected error, please try again later or seek support in Discord.'];
      return;
    }

    const request = new MiningQuote(new FixedDecimal(this.amount.value, this.pool.tokens.lp.decimals));

    this._platformApi
      .startMiningQuote(this.pool.miningPool.address, request.payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote),
                   (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  handlePercentageSelect(value: any): void {
    this.percentageSelected = value.percentageOption;
    this.amount.setValue(value.result, {emitEvent: true});
  }

  private validateBalance(): Observable<boolean> {
    if (!this.amount.value || !this.context?.wallet || !this.pool) {
      return of(false);
    }

    const amountNeeded = new FixedDecimal(this.amount.value, this.pool.tokens.lp.decimals);

    return this._validateBalance$(this.pool.tokens.lp, amountNeeded)
      .pipe(tap(result => this.balanceError = !result));
  }

  private setFiatValue(amount: FixedDecimal): void {
    this.fiatValue = this.pool.tokens.lp.summary.priceUsd.multiply(amount);
  }

  private getAllowance$(amount?: string): Observable<AllowanceValidation> {
    amount = amount || this.amount.value;
    const spender = this.pool?.miningPool?.address;
    const token = this.pool?.tokens?.lp;

    return this._validateAllowance$(this.context.wallet, spender, token, amount)
      .pipe(tap(allowance => this.allowance = allowance));
  }

  private reset(): void {
    this.form.reset();
    this.fiatValue = null;
    this.allowance = null;
    this.balanceError = null;
    this.percentageSelected = null;
  }

  destroyContext$(): void {
    this.context$.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroyContext$();
    if (this.allowance$) this.allowance$.unsubscribe();
    if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
    if (this.latestSyncedBlock$) this.latestSyncedBlock$.unsubscribe();
  }
}
