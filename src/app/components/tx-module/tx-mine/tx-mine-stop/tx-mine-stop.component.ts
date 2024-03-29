import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Injector, OnChanges, OnDestroy } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Icons } from 'src/app/enums/icons';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { Observable, of, Subscription } from 'rxjs';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MiningQuote } from '@sharedModels/platform-api/requests/mining-pools/mining-quote';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';

@Component({
  selector: 'opdex-tx-mine-stop',
  templateUrl: './tx-mine-stop.component.html',
  styleUrls: ['./tx-mine-stop.component.scss']
})
export class TxMineStopComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data;
  icons = Icons;
  form: FormGroup;
  pool: LiquidityPool;
  subscription = new Subscription();
  fiatValue: FixedDecimal;
  percentageSelected: string;
  balanceError: boolean;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get percentageOfSupply() {
    const oneHundred = FixedDecimal.OneHundred(8);
    const { miningPool, tokens } = this.pool;
    if (miningPool.tokensMining.isZero) return oneHundred;
    const outputWeight = new FixedDecimal(this.amount.value, tokens.lp.decimals);
    return outputWeight.divide(miningPool.tokensMining).multiply(oneHundred);
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    protected _injector: Injector,
  ) {
    super(_injector);

    this.form = this._fb.group({
      amount: [null, [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]]
    });

    this.subscription.add(
      this.amount.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          map(amount => {
            const amountFixed = new FixedDecimal(amount || '0', this.pool.tokens.lp.decimals);
            amountFixed.isZero ? this.reset() : this.setFiatValue(amountFixed);
            return amountFixed;
          }),
          filter(amount => !!this.context?.wallet && amount.bigInt > 0),
          switchMap(_ => this.validateMiningBalance()))
        .subscribe());
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
    this.reset();
  }

  submit(): void {
    const request = new MiningQuote(new FixedDecimal(this.amount.value, this.pool.tokens.lp.decimals));

    this._platformApi.stopMiningQuote(this.pool.miningPool.address, request.payload)
      .pipe(take(1))
      .subscribe((quote: ITransactionQuote) => this.quote(quote),
                  (error: OpdexHttpError) => this.quoteErrors = error.errors);
}

  handlePercentageSelect(value: any): void {
    this.percentageSelected = value.percentageOption;
    this.amount.setValue(value.result, {emitEvent: true});
  }

  private setFiatValue(amount: FixedDecimal): void {
    this.fiatValue = this.pool.tokens.lp.summary.priceUsd.multiply(amount);
  }

  private validateMiningBalance(): Observable<boolean> {
    if (!this.amount.value || !this.context?.wallet || !this.pool) {
      return of(false);
    }

    const amountNeeded = new FixedDecimal(this.amount.value, this.pool.tokens.lp.decimals);

    return this._validateMiningBalance$(this.pool, amountNeeded)
      .pipe(tap(result => this.balanceError = !result));
  }

  private reset(): void {
    this.form.reset();
    this.fiatValue = null;
    this.balanceError = null;
    this.percentageSelected = null;
  }

  destroyContext$(): void {
    this.context$.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroyContext$();
    this.subscription.unsubscribe();
  }
}
