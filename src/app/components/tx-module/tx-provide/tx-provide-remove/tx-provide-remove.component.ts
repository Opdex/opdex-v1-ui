import { map } from 'rxjs/operators';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Component, Input, Injector, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
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
import { UserContext } from '@sharedModels/user-context';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

@Component({
  selector: 'opdex-tx-provide-remove',
  templateUrl: './tx-provide-remove.component.html',
  styleUrls: ['./tx-provide-remove.component.scss'],
  animations: [CollapseAnimation]
})
export class TxProvideRemoveComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() pool: LiquidityPool;
  icons = Icons;
  iconSizes = IconSizes;
  form: FormGroup;
  context: UserContext;
  allowance$: Subscription;
  transactionTypes = AllowanceRequiredTransactionTypes;
  showMore: boolean = false;
  lptInFiatValue: FixedDecimal;
  usdOut: FixedDecimal;
  crsOut: FixedDecimal;
  crsOutMin: FixedDecimal;
  srcOut: FixedDecimal;
  srcOutMin: FixedDecimal;
  deadlineBlock: number;
  toleranceThreshold = 5;
  deadlineThreshold = 10;
  allowanceTransaction$: Subscription;
  allowance: AllowanceValidation;
  latestSyncedBlock$: Subscription;
  latestBlock: number;
  percentageSelected: string;
  balanceError: boolean;
  showTransactionDetails: boolean = true;

  get liquidity(): FormControl {
    return this.form.get('liquidity') as FormControl;
  }

  get percentageOfSupply() {
    const { tokens } = this.pool;
    const lpInput = new FixedDecimal(this.liquidity.value, tokens.lp.decimals);
    return lpInput.divide(tokens.lp.totalSupply).multiply(FixedDecimal.OneHundred(0));
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
        map(amount => {
          const amountFixed = new FixedDecimal(amount || '0', this.pool.tokens.lp.decimals);
          amountFixed.isZero ? this.reset() : this.calcTolerance();
          return amountFixed;
        }),
        filter(amount => !!this.context?.wallet && amount.bigInt > 0),
        switchMap(amount => this.getAllowance$(amount.formattedValue)),
        switchMap(allowance => this.validateBalance(allowance.requestToSpend)))
      .subscribe();

    this.latestSyncedBlock$ = this._indexService.getLatestBlock$()
      .pipe(
        tap(block => this.latestBlock = block?.height),
        tap(_ => this.calcDeadline(this.deadlineThreshold)),
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
    this.calcDeadline(this.deadlineThreshold);

    const request = new RemoveLiquidityRequest(
      new FixedDecimal(this.liquidity.value, this.pool.tokens.lp.decimals),
      this.crsOutMin,
      this.srcOutMin,
      this.context.wallet,
      this.deadlineBlock
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

    const lptDecimals = this.pool.tokens.lp.decimals;
    const liquidityValue = new FixedDecimal(this.liquidity.value, lptDecimals);
    const totalSupply = this.pool.tokens.lp.totalSupply;
    const reservesUsd = this.pool.summary.reserves.usd;
    const reserveCrs = this.pool.summary.reserves.crs;
    const reserveSrc = this.pool.summary.reserves.src;

    const percentageLiquidity = liquidityValue.divide(totalSupply);

    this.crsOut = reserveCrs.multiply(percentageLiquidity);
    this.srcOut = reserveSrc.multiply(percentageLiquidity);
    this.usdOut = reservesUsd.multiply(percentageLiquidity);

    const tolerancePercentage = new FixedDecimal((this.toleranceThreshold / 100).toFixed(8), 8);

    const crsTolerance = this.crsOut.multiply(tolerancePercentage);
    const srcTolerance = this.srcOut.multiply(tolerancePercentage);
    const usdTolerance = this.usdOut.multiply(tolerancePercentage);

    this.crsOutMin = this.crsOut.subtract(crsTolerance);
    this.srcOutMin = this.srcOut.subtract(srcTolerance);
    this.lptInFiatValue = this.usdOut.subtract(usdTolerance);
  }

  toggleShowMore(value: boolean): void {
    this.showMore = value;
  }

  toggleShowTransactionDetails(): void {
    this.showTransactionDetails = !this.showTransactionDetails;
  }

  calcDeadline(minutes: number): void {
    this.deadlineThreshold = minutes;
    const blocks = Math.ceil(60 * minutes / 16);
    this.deadlineBlock = blocks + this.latestBlock;
  }

  handlePercentageSelect(value: any): void {
    this.percentageSelected = value.percentageOption;
    this.liquidity.setValue(value.result, {emitEvent: true});
  }

  private getAllowance$(amount?: string): Observable<AllowanceValidation> {
    amount = amount || this.liquidity.value;

    return this._validateAllowance$(this.context.wallet, this._env.routerAddress, this.pool?.tokens?.lp, amount)
      .pipe(tap(allowance => this.allowance = allowance));
  }

  private validateBalance(amount: FixedDecimal): Observable<boolean> {
    if (!this.context?.wallet || !this.pool) {
      return of(false);
    }

    return this._validateBalance$(this.pool.tokens.lp, amount)
      .pipe(tap(result => this.balanceError = !result));
  }

  private reset(): void {
    this.form.reset();
    this.lptInFiatValue = null;
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
