import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { OnDestroy } from '@angular/core';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap, take, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { StartStakingRequest } from '@sharedModels/platform-api/requests/liquidity-pools/start-staking-request';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';

@Component({
  selector: 'opdex-tx-stake-start',
  templateUrl: './tx-stake-start.component.html',
  styleUrls: ['./tx-stake-start.component.scss']
})
export class TxStakeStartComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data;
  icons = Icons;
  form: FormGroup;
  pool: LiquidityPool;
  allowance$: Subscription;
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
    const { summary, tokens } = this.pool;
    if (summary.staking.weight.isZero) return oneHundred;
    const inputWeight = new FixedDecimal(this.amount.value, tokens.staking.decimals);
    return inputWeight.divide(summary.staking.weight).multiply(oneHundred);
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

    this.latestSyncedBlock$ = this._indexService.latestBlock$
      .pipe(
        filter(_ => !!this.context.wallet),
        switchMap(_ => this.getAllowance$()),
        switchMap(_ => this.validateBalance()))
      .subscribe();

    this.allowance$ = this.amount.valueChanges
      .pipe(
        debounceTime(300),
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

    const request = new StartStakingRequest(new FixedDecimal(this.amount.value, this.pool.tokens.staking.decimals));

    this._platformApi
      .startStakingQuote(this.pool.address, request.payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote),
                   (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  handlePercentageSelect(value: any): void {
    this.percentageSelected = value.percentageOption;
    this.amount.setValue(value.result, {emitEvent: true});
  }

  private validateBalance(): Observable<boolean> {
    if (!this.amount.value || !this.context?.wallet || !this.pool || !this.pool.summary.staking) {
      return of(false);
    }

    const amountNeeded = new FixedDecimal(this.amount.value, this.pool.tokens.lp.decimals);

    return this._validateBalance$(this.pool.tokens.staking, amountNeeded)
      .pipe(tap(result => this.balanceError = !result));
  }

  private setFiatValue(amount: FixedDecimal): void {
    const stakingTokenFiat = this.pool.tokens.staking?.summary?.priceUsd || FixedDecimal.Zero(8);
    this.fiatValue = stakingTokenFiat.multiply(amount);
  }

  private getAllowance$(amount?: string): Observable<AllowanceValidation> {
    amount = amount || this.amount.value;
    const spender = this.pool?.address;
    const token = this.pool?.tokens?.staking;

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
    if (this.latestSyncedBlock$) this.latestSyncedBlock$.unsubscribe();
    if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
  }
}
