import { Token } from '@sharedModels/ui/tokens/token';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { OnDestroy } from '@angular/core';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { Component, Input, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, throwError } from 'rxjs';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, catchError, take, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Icons } from 'src/app/enums/icons';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { AddLiquidityRequest } from '@sharedModels/platform-api/requests/liquidity-pools/add-liquidity-request';
import { IAddLiquidityAmountInQuoteRequest } from '@sharedModels/platform-api/requests/quotes/add-liquidity-amount-in-quote-request';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { CollapseAnimation } from '@sharedServices/animations/collapse';
import { IProvideAmountInResponse } from '@sharedModels/platform-api/responses/liquidity-pools/provide-amount-in-response.interface';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';

@Component({
  selector: 'opdex-tx-provide-add',
  templateUrl: './tx-provide-add.component.html',
  styleUrls: ['./tx-provide-add.component.scss'],
  animations: [CollapseAnimation]
})
export class TxProvideAddComponent extends TxBase implements OnDestroy {
  @Input() pool: LiquidityPool;
  icons = Icons;
  iconSizes = IconSizes;
  txHash: string;
  subscription = new Subscription();
  allowance: AllowanceValidation;
  form: FormGroup;
  transactionTypes = AllowanceRequiredTransactionTypes;
  showMore: boolean = false;
  crsInFiatValue: FixedDecimal;
  srcInFiatValue: FixedDecimal;
  toleranceThreshold = 5;
  deadlineThreshold = 10;
  crsInMin: FixedDecimal;
  srcInMin: FixedDecimal;
  deadlineBlock: number;
  latestSyncedBlock$: Subscription;
  latestBlock: number;
  crsPercentageSelected: string;
  srcPercentageSelected: string;
  crsBalanceError: boolean;
  srcBalanceError: boolean;
  showTransactionDetails: boolean = true;

  get amountCrs(): FormControl {
    return this.form.get('amountCrs') as FormControl;
  }

  get amountSrc(): FormControl {
    return this.form.get('amountSrc') as FormControl;
  }

  get percentageOfSupply() {
    const { summary, tokens } = this.pool;
    const crsInput = new FixedDecimal(this.amountCrs.value, tokens.crs.decimals);
    if (summary.reserves.crs.isZero) return FixedDecimal.OneHundred(8);
    return crsInput.divide(summary.reserves.crs).multiply(FixedDecimal.OneHundred(0));
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    private _env: EnvironmentsService,
    protected _injector: Injector
  ) {
    super(_injector);

    if (this.context?.preferences?.deadlineThreshold) {
      this.deadlineThreshold = this.context.preferences.deadlineThreshold;
    }

    if (this.context?.preferences?.toleranceThreshold) {
      this.toleranceThreshold = this.context.preferences.toleranceThreshold;
    }

    this.form = this._fb.group({
      amountCrs: [null, [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]],
      amountSrc: [null, [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]],
    });

    // Investigate
    // Set CRS amount in (quotes and sets SRC amount)
    // Change SRC amount (quote and change CRS amount)
    // Change CRS amount (12.24999999 to 12.25) registers no change, no re-quote is given.
    // FINDINGS
    // This is because CRS value is manually typed, auto populates SRC value with quote. Change SRC value, auto re-populates CRS from quote.
    // Then changing CRS does not get triggered by DistinctUntilChanged(), it never knew about the auto populated quote changes so it thinks nothing changed.
    //
    // This isn't reproducible 100% of the time, there must be more to it.
    // ----
    // Working as expected - will circle back and remove 2/4/22
    this.subscription.add(
      this.amountCrs.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          map(amount => {
            const amountFixed = new FixedDecimal(amount || '0', this.pool.tokens.crs.decimals);
            if (amountFixed.isZero) this.reset();
            return amountFixed;
          }),
          filter(amount => amount.bigInt > 0),
          switchMap(amount => this.quote$(amount.formattedValue, this.pool?.tokens?.crs)),
          tap(amount => {
            if (amount !== '') this.amountSrc.setValue(amount, { emitEvent: false })
          }),
          tap(_ => this.calcTolerance()),
          filter(_ => !!this.context.wallet),
          switchMap(_ => this.getAllowance$()),
          switchMap(_ => this.validateBalances()))
        .subscribe());

    this.subscription.add(
      this.amountSrc.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          map(amount => {
            const amountFixed = new FixedDecimal(amount || '0', this.pool.tokens.src.decimals);
            if (amountFixed.isZero) this.reset();
            return amountFixed;
          }),
          filter(amount => amount.bigInt > 0),
          switchMap(amount => this.quote$(amount.formattedValue, this.pool?.tokens?.src)),
          tap(quoteAmount => {
            if (quoteAmount !== '') this.amountCrs.setValue(quoteAmount, { emitEvent: false })
          }),
          tap(_ => this.calcTolerance()),
          filter(_ => !!this.context.wallet),
          switchMap(_ => this.getAllowance$()),
          switchMap(_ => this.validateBalances()))
        .subscribe());

    this.latestSyncedBlock$ = this._indexService.latestBlock$
      .pipe(
        tap(block => this.latestBlock = block?.height),
        tap(_ => this.calcDeadline(this.deadlineThreshold)),
        filter(_ => !!this.context.wallet),
        switchMap(_ => this.getAllowance$()),
        switchMap(_ => this.validateBalances()))
      .subscribe();
  }

  ngOnChanges(): void {
    this.reset();
  }

  quote$(value: string, tokenIn: Token): Observable<string> {
    if (!tokenIn) throwError('Invalid token');
    if (!value || !this.pool.summary.reserves?.crs || this.pool.summary.reserves.crs.isZero) return of('');

    // Technically the input should be made invalid in this case using form validations, cannot end with decimal point
    if (value.endsWith('.')) value = `${value}00`;

    const payload: IAddLiquidityAmountInQuoteRequest = {
      amountIn: value,
      tokenIn: tokenIn.address
    };

    return this._platformApi.quoteAddLiquidity(this.pool.address, payload)
      .pipe(
        map((response: IProvideAmountInResponse) => response?.amountIn || ''),
        catchError(() => {
          const isBasedOnCrs = tokenIn.address.toLowerCase() === 'crs';

          if (isBasedOnCrs) this.amountCrs.setErrors({ invalidAmountEquivalent: true });
          else this.amountSrc.setErrors({ invalidAmountEquivalent: true });

          return of('')
        }));
  }

  submit(): void {
    // Temporary
    const walletConflicts = this._env.prevention.wallets.includes(this.context.wallet);
    const poolConflicts = this._env.prevention.pools.includes(this.pool.address);

    if (walletConflicts || poolConflicts) {
      this.quoteErrors = ['Unexpected error, please try again later or seek support in Discord.'];
      return;
    }

    this.calcDeadline(this.deadlineThreshold);
    const request = new AddLiquidityRequest(
      new FixedDecimal(this.amountCrs.value, this.pool.tokens.crs.decimals),
      new FixedDecimal(this.amountSrc.value, this.pool.tokens.src.decimals),
      this.crsInMin,
      this.srcInMin,
      this.context.wallet,
      this.deadlineBlock
    );

    this._platformApi
      .addLiquidityQuote(this.pool.address, request.payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote),
                   (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  calcTolerance(tolerance?: number): void {
    if (tolerance) this.toleranceThreshold = tolerance;

    if (this.toleranceThreshold > 99.99 || this.toleranceThreshold < .01) return;
    if (!this.amountCrs.value || !this.amountSrc.value) return;

    const crsInValue = new FixedDecimal(this.amountCrs.value, this.pool.tokens.crs.decimals);
    const crsMinTolerance = crsInValue.multiply(new FixedDecimal((this.toleranceThreshold / 100).toFixed(8), 8));
    this.crsInMin = crsInValue.subtract(crsMinTolerance);

    const srcInValue = new FixedDecimal(this.amountSrc.value, this.pool.tokens.src.decimals);
    const srcMinTolerance = srcInValue.multiply(new FixedDecimal((this.toleranceThreshold / 100).toFixed(8), 8));
    this.srcInMin = srcInValue.subtract(srcMinTolerance);

    const amountCrs = new FixedDecimal(this.amountCrs.value, this.pool.tokens.crs.decimals);
    const priceCrs = this.pool.tokens.crs.summary.priceUsd;
    const amountSrc = new FixedDecimal(this.amountSrc.value, this.pool.tokens.src.decimals);
    const priceSrc = this.pool.tokens.src.summary.priceUsd;

    this.crsInFiatValue = amountCrs.multiply(priceCrs);
    this.srcInFiatValue = amountSrc.multiply(priceSrc);
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

  handlePercentageSelect(field: string, value: any): void {
    if (field === 'crs') {
      this.crsPercentageSelected = value.percentageOption;
      this.srcPercentageSelected = null;
      this.amountCrs.setValue(value.result, {emitEvent: true});
    } else {
      this.crsPercentageSelected = null;
      this.srcPercentageSelected = value.percentageOption;
      this.amountSrc.setValue(value.result, {emitEvent: true});
    }
  }

  private validateBalances(): Observable<void> {
    if (!this.pool || !this.context?.wallet) {
      return of();
    }

    const crsNeeded = new FixedDecimal(this.amountCrs.value, this.pool.tokens.crs.decimals);
    const srcNeeded = new FixedDecimal(this.amountSrc.value, this.pool.tokens.src.decimals);

    return this.validateBalance(this.pool.tokens.crs, crsNeeded)
      .pipe(
        tap(result => this.crsBalanceError = !result),
        switchMap(_ => this.validateBalance(this.pool.tokens.src, srcNeeded)),
        tap(result => this.srcBalanceError = !result),
        map(_ => null));
  }

  private validateBalance(token: Token, amount: FixedDecimal): Observable<boolean> {
    if (!this.context?.wallet || !this.pool) {
      return of(false);
    }

    return this._validateBalance$(token, amount);
  }

  private getAllowance$(): Observable<AllowanceValidation> {
    if (!!this.pool === false) return of();

    return this._validateAllowance$(this.context.wallet, this._env.routerAddress, this.pool.tokens.src, this.amountSrc.value)
      .pipe(tap(allowance => this.allowance = allowance));
  }

  private reset(): void {
    this.form.reset({}, {emitEvent: false});
    this.allowance = null;
    this.crsInFiatValue = null;
    this.srcInFiatValue = null;
    this.crsInMin = null;
    this.srcInMin = null;
    this.crsPercentageSelected = null;
    this.srcPercentageSelected = null;
    this.crsBalanceError = null;
    this.srcBalanceError = null;
  }

  destroyContext$(): void {
    this.context$.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroyContext$();
    this.subscription.unsubscribe();
    if (this.latestSyncedBlock$) this.latestSyncedBlock$.unsubscribe();
  }
}
