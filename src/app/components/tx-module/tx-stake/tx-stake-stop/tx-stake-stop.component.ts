import { OnDestroy } from '@angular/core';
import { MathService } from '@sharedServices/utility/math.service';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { debounceTime, distinctUntilChanged, take, tap, switchMap } from 'rxjs/operators';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Icons } from 'src/app/enums/icons';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { Observable, of, Subscription } from 'rxjs';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { StopStakingRequest } from '@sharedModels/platform-api/requests/liquidity-pools/stop-staking-request';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';

@Component({
  selector: 'opdex-tx-stake-stop',
  templateUrl: './tx-stake-stop.component.html',
  styleUrls: ['./tx-stake-stop.component.scss']
})
export class TxStakeStopComponent extends TxBase implements OnChanges, OnDestroy {
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

  get liquidate(): FormControl {
    return this.form.get('liquidate') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _injector: Injector,
    private _platformApi: PlatformApiService,
  ) {
    super(_injector);

    this.form = this._fb.group({
      amount: [null, [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]],
      liquidate: [false]
    });

    this.subscription.add(
      this.amount.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          tap(amount => {
            const stakingTokenFiat = new FixedDecimal(this.pool.summary.staking?.token.summary.priceUsd.toString(), 8);
            const amountDecimal = new FixedDecimal(amount, this.pool.summary.staking?.token.decimals);
            this.fiatValue = MathService.multiply(amountDecimal, stakingTokenFiat);
          }),
          switchMap(_ => this.validateStakingBalance()))
        .subscribe());
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
    this.reset();
  }

  submit(): void {
    const request = new StopStakingRequest(new FixedDecimal(this.amount.value, this.pool.summary.staking.token.decimals), this.liquidate.value);

    this._platformApi
      .stopStakingQuote(this.pool.address, request.payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote),
                   (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  handlePercentageSelect(value: any): void {
    this.percentageSelected = value.percentageOption;
    this.amount.setValue(value.result, {emitEvent: true});
  }

  private validateStakingBalance(): Observable<boolean> {
    if (!this.amount.value || !this.context?.wallet || !this.pool?.summary?.staking?.token) {
      return of(false);
    }

    const amountNeeded = new FixedDecimal(this.amount.value, this.pool.summary.staking.token.decimals);

    return this._validateStakingBalance$(this.pool, amountNeeded)
      .pipe(tap(result => this.balanceError = !result));
  }

  private reset(): void {
    this.form.reset();
    this.fiatValue = null;
    this.balanceError = null;
  }

  destroyContext$(): void {
    this.context$.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroyContext$();
    this.subscription.unsubscribe();
  }
}
