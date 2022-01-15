import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { Component, Input, Injector, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { switchMap, take, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Icons } from 'src/app/enums/icons';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { RemoveLiquidityRequest } from '@sharedModels/platform-api/requests/liquidity-pools/remove-liquidity-request';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { CollapseAnimation } from '@sharedServices/animations/collapse';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';

@Component({
  selector: 'opdex-tx-provide-remove',
  templateUrl: './tx-provide-remove.component.html',
  styleUrls: ['./tx-provide-remove.component.scss'],
  animations: [CollapseAnimation]
})
export class TxProvideRemoveComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() pool: ILiquidityPoolResponse;
  icons = Icons;
  iconSizes = IconSizes;
  form: FormGroup;
  context: any;
  allowance$: Subscription;
  transactionTypes = AllowanceRequiredTransactionTypes;
  showMore: boolean = false;
  lptInFiatValue: string;
  lptInMinFiatValue: string;
  usdOut: string;
  crsOut: string;
  crsOutMin: string;
  srcOut: string;
  srcOutMin: string;
  toleranceThreshold = 0.1;
  deadlineThreshold = 10;
  allowanceTransaction$: Subscription;
  allowance: AllowanceValidation;
  latestSyncedBlock$: Subscription;
  latestBlock: number;
  percentageSelected: string;
  balanceError: boolean;

  get liquidity(): FormControl {
    return this.form.get('liquidity') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    protected _injector: Injector,
    private _indexService: IndexService,
    private _env: EnvironmentsService
  ) {
    super(_injector);

    if (this.context?.preferences?.deadlineThreshold) {
      this.deadlineThreshold = this.context.preferences.deadlineThreshold;
    }

    if (this.context?.preferences?.toleranceThreshold) {
      this.toleranceThreshold = this.context.preferences.toleranceThreshold;
    }

    this.form = this._fb.group({
      liquidity: [null, [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]],
    });

    this.allowance$ = this.liquidity.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.calcTolerance()),
        filter(amount => !!this.context?.wallet && !!amount),
        switchMap(amount => this.getAllowance$(amount)),
        switchMap(allowance => this.validateBalance(allowance.requestToSpend)))
      .subscribe();

    this.latestSyncedBlock$ = this._indexService.getLatestBlock$()
      .pipe(
        tap(block => this.latestBlock = block?.height),
        filter(_ => !!this.context?.wallet && !!this.pool),
        switchMap(_ => this.getAllowance$()))
      .subscribe();
  }

  ngOnChanges(): void {
    this.reset();

    if (!!this.pool === false) return;

    if (this.liquidity.value) {
      this.getAllowance$(this.liquidity.value)
        .pipe(
          tap(_ => this.calcTolerance()),
          switchMap(allowance => this.validateBalance(allowance.requestToSpend)),
          take(1))
        .subscribe()
    }
  }

  submit(): void {
    const request = new RemoveLiquidityRequest(
      new FixedDecimal(this.liquidity.value, this.pool.token.lp.decimals),
      new FixedDecimal(this.crsOutMin, this.pool.token.crs.decimals),
      new FixedDecimal(this.srcOutMin, this.pool.token.src.decimals),
      this.context.wallet,
      this.calcDeadline(this.deadlineThreshold)
    );

    this._platformApi
      .removeLiquidityQuote(this.pool.address, request.payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote),
                   (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  calcTolerance(tolerance?: number): void {
    if (tolerance) this.toleranceThreshold = tolerance;

    if (this.toleranceThreshold > 99.99 || this.toleranceThreshold < .01) return;
    if (!this.liquidity.value) return;

    const lptDecimals = this.pool.token.lp.decimals;
    const liquidityValue = new FixedDecimal(this.liquidity.value, lptDecimals);
    const totalSupply = new FixedDecimal(this.pool.token.lp.totalSupply.toString(), lptDecimals);

    const crsDecimals = this.pool.token.crs.decimals;
    const srcDecimals = this.pool.token.src.decimals;
    const reservesUsd = new FixedDecimal(this.pool.summary.reserves.usd.toFixed(8), 8);
    const reserveCrs = new FixedDecimal(this.pool.summary.reserves.crs, crsDecimals);
    const reserveSrc = new FixedDecimal(this.pool.summary.reserves.src, srcDecimals);

    const percentageLiquidity = new FixedDecimal(MathService.divide(liquidityValue, totalSupply), 8);

    this.crsOut = MathService.multiply(reserveCrs, percentageLiquidity);
    this.srcOut = MathService.multiply(reserveSrc, percentageLiquidity);
    this.usdOut = MathService.multiply(reservesUsd, percentageLiquidity);

    const crsOut = new FixedDecimal(this.crsOut, crsDecimals);
    const srcOut = new FixedDecimal(this.srcOut, srcDecimals);
    const usdOut = new FixedDecimal(this.usdOut, 8);

    const tolerancePercentage = new FixedDecimal((this.toleranceThreshold / 100).toFixed(8), 8);

    const crsTolerance = new FixedDecimal(MathService.multiply(crsOut, tolerancePercentage), crsDecimals);
    const srcTolerance = new FixedDecimal(MathService.multiply(srcOut, tolerancePercentage), srcDecimals);
    const usdTolerance = new FixedDecimal(MathService.multiply(usdOut, tolerancePercentage), 8);

    this.crsOutMin = MathService.subtract(crsOut, crsTolerance);
    this.srcOutMin = MathService.subtract(srcOut, srcTolerance);
    this.lptInFiatValue = MathService.subtract(usdOut, usdTolerance);
  }

  toggleShowMore(value: boolean): void {
    this.showMore = value;
  }

  calcDeadline(minutes: number): number {
    this.deadlineThreshold = minutes;
    const blocks = Math.ceil(60 * minutes / 16);

    return blocks + this.latestBlock;
  }

  handlePercentageSelect(value: any): void {
    this.percentageSelected = value.percentageOption;
    this.liquidity.setValue(value.result, {emitEvent: true});
  }

  private getAllowance$(amount?: string): Observable<AllowanceValidation> {
    amount = amount || this.liquidity.value;

    return this._validateAllowance$(this.context.wallet, this._env.routerAddress, this.pool?.token?.lp, amount)
      .pipe(tap(allowance => this.allowance = allowance));
  }

  private validateBalance(amount: FixedDecimal): Observable<boolean> {
    if (!this.context?.wallet || !this.pool) {
      return of(false);
    }

    return this._validateBalance$(this.pool.token.lp, amount)
      .pipe(tap(result => this.balanceError = !result));
  }

  private reset(): void {
    this.form.reset();
    this.lptInFiatValue = null;
    this.lptInMinFiatValue = null;
    this.usdOut = null;
    this.crsOut = null;
    this.crsOutMin = null;
    this.srcOut = null;
    this.srcOutMin = null;
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
