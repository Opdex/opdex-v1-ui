import { OnDestroy } from '@angular/core';
import { MathService } from '@sharedServices/utility/math.service';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, map, switchMap, take, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MiningQuote } from '@sharedModels/platform-api/requests/mining-pools/mining-quote';
import { IndexService } from '@sharedServices/platform/index.service';
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
  pool: ILiquidityPoolResponse;
  allowance$ = new Subscription();
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
      amount: ['', [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]]
    });

    this.allowance$ = this.amount.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(amount => this.setFiatValue(amount)),
        switchMap((amount: string) => this.getAllowance$(amount)),
        switchMap(_ => this.validateBalance()))
      .subscribe();

    this.latestSyncedBlock$ = this._indexService.getLatestBlock$()
      .pipe(
        filter(_ => this.context?.wallet),
        switchMap(_ => this.getAllowance$()))
      .subscribe();
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  submit(): void {
    const request = new MiningQuote(new FixedDecimal(this.amount.value, this.pool.token.lp.decimals));

    this._platformApi
      .startMiningQuote(this.pool.summary.miningPool.address, request.payload)
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

    const amountNeeded = new FixedDecimal(this.amount.value, this.pool.token.lp.decimals);

    return this._validateBalance$(this.pool.token.lp, amountNeeded)
      .pipe(tap(result => this.balanceError = !result));
  }

  private setFiatValue(amount: string): void {
    const lptFiat = new FixedDecimal(this.pool.token.lp.summary.priceUsd.toString(), 8);
    const amountDecimal = new FixedDecimal(amount, this.pool.token.lp.decimals);

    this.fiatValue = MathService.multiply(amountDecimal, lptFiat);
  }

  private getAllowance$(amount?: string): Observable<AllowanceValidation> {
    amount = amount || this.amount.value;
    const spender = this.pool?.summary?.miningPool?.address;
    const token = this.pool?.token?.lp;

    return this._validateAllowance$(this.context.wallet, spender, token, amount)
      .pipe(tap(allowance => this.allowance = allowance));
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
