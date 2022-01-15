import { MathService } from '@sharedServices/utility/math.service';
import { debounceTime, distinctUntilChanged, switchMap, take, tap } from 'rxjs/operators';
import { Injector, OnChanges, OnDestroy } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
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
  pool: ILiquidityPoolResponse;
  subscription = new Subscription();
  fiatValue: string;
  percentageSelected: string;
  balanceError: boolean;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
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
          tap(amount => {
            const lptFiat = new FixedDecimal(this.pool.token.lp.summary.priceUsd.toString(), 8);
            const amountDecimal = new FixedDecimal(amount, this.pool.token.lp.decimals);
            this.fiatValue = MathService.multiply(amountDecimal, lptFiat);
          }),
          switchMap(_ => this.validateMiningBalance()))
        .subscribe());
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
    this.reset();
  }

  submit(): void {
    const request = new MiningQuote(new FixedDecimal(this.amount.value, this.pool.token.lp.decimals));

    this._platformApi.stopMiningQuote(this.pool.summary.miningPool.address, request.payload)
      .pipe(take(1))
      .subscribe((quote: ITransactionQuote) => this.quote(quote),
                  (error: OpdexHttpError) => this.quoteErrors = error.errors);
}

  handlePercentageSelect(value: any): void {
    this.percentageSelected = value.percentageOption;
    this.amount.setValue(value.result, {emitEvent: true});
  }

  private validateMiningBalance(): Observable<boolean> {
    if (!this.amount.value || !this.context?.wallet || !this.pool) {
      return of(false);
    }

    const amountNeeded = new FixedDecimal(this.amount.value, this.pool.token.lp.decimals);

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
