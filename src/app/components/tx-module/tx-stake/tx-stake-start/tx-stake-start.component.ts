import { OnDestroy } from '@angular/core';
import { IndexService } from '@sharedServices/platform/index.service';
import { MathService } from '@sharedServices/utility/math.service';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap, take, distinctUntilChanged, filter } from 'rxjs/operators';
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
  pool: ILiquidityPoolResponse;
  allowance$: Subscription;
  transactionTypes = AllowanceRequiredTransactionTypes;
  fiatValue: string;
  allowance: AllowanceValidation;
  allowanceTransaction$ = new Subscription();
  latestSyncedBlock$: Subscription;
  percentageSelected: string;
  balanceError: boolean;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    protected _injector: Injector,
    private _indexService: IndexService
  ) {
    super(_injector);

    this.form = this._fb.group({
      amount: [null, [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]]
    });

    this.latestSyncedBlock$ = this._indexService.getLatestBlock$()
      .pipe(
        filter(_ => this.context?.wallet),
        switchMap(_ => this.getAllowance$()),
        switchMap(_ => this.validateBalance()))
      .subscribe();

    this.allowance$ = this.amount.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(amount => this.setFiatValue(amount)),
        switchMap((amount: string) => this.getAllowance$(amount)),
        switchMap(_ => this.validateBalance()))
      .subscribe();
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
    this.reset();
  }

  submit(): void {
    const request = new StartStakingRequest(new FixedDecimal(this.amount.value, this.pool.summary.staking.token.decimals));

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

    const amountNeeded = new FixedDecimal(this.amount.value, this.pool.token.lp.decimals);

    return this._validateBalance$(this.pool.summary.staking.token, amountNeeded)
      .pipe(tap(result => this.balanceError = !result));
  }

  private setFiatValue(amount: string): void {
    if (!!amount === false) {
      this.fiatValue = null;
      return;
    }

    const stakingTokenFiat = new FixedDecimal(this.pool.summary.staking?.token.summary.priceUsd.toString(), 8);
    const amountDecimal = new FixedDecimal(amount, this.pool.summary.staking?.token.decimals);

    this.fiatValue = MathService.multiply(amountDecimal, stakingTokenFiat);
  }

  private getAllowance$(amount?: string): Observable<AllowanceValidation> {
    amount = amount || this.amount.value;
    const spender = this.pool?.address;
    const token = this.pool?.summary?.staking?.token;

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
