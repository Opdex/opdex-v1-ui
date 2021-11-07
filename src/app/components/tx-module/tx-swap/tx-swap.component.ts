import { TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { ISwapAmountInQuoteResponse } from '@sharedModels/platform-api/responses/tokens/swap-amount-in-quote-response.interface';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Input, OnDestroy, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, of, Observable } from 'rxjs';
import { debounceTime, take, distinctUntilChanged, switchMap, map, tap, catchError, filter } from 'rxjs/operators';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Icons } from 'src/app/enums/icons';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { TxBase } from '../tx-base.component';
import { IToken, IMarketToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { ISwapRequest, SwapRequest } from '@sharedModels/platform-api/requests/tokens/swap-request';
import { SwapAmountInQuoteRequest } from '@sharedModels/platform-api/requests/tokens/swap-amount-in-quote-request';
import { SwapAmountOutQuoteRequest } from '@sharedModels/platform-api/requests/tokens/swap-amount-out-quote-request';
import { ISwapAmountOutQuoteResponse } from '@sharedModels/platform-api/responses/tokens/swap-amount-out-quote-response.interface';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { CollapseAnimation } from '@sharedServices/animations/collapse';

@Component({
  selector: 'opdex-tx-swap',
  templateUrl: './tx-swap.component.html',
  styleUrls: ['./tx-swap.component.scss'],
  animations: [CollapseAnimation]
})
export class TxSwapComponent extends TxBase implements OnDestroy {
  @Input() data: any;
  icons = Icons;
  iconSizes = IconSizes;
  tokenInExact = true;
  form: FormGroup;
  tokenInChanges$: Subscription;
  tokenOutChanges$: Subscription;
  tokenInDetails: IMarketToken;
  tokenOutDetails: IMarketToken;
  allowance: AllowanceValidation;
  transactionTypes = AllowanceRequiredTransactionTypes;
  showMore: boolean = false;
  tokenInFiatValue: string;
  tokenInMaxFiatValue: string;
  tokenOutFiatValue: string;
  tokenOutMinFiatValue: string;
  toleranceThreshold = 0.1;
  deadlineThreshold = 10;
  tokenInMax: string;
  tokenOutMin: string;
  tokens$: Observable<IToken[]>;
  changeTokenIn: boolean = false;
  changeTokenOut: boolean;
  allowanceTransaction$: Subscription;
  latestSyncedBlock$: Subscription;
  latestBlock: number;
  tokenAmountInPercentageSelected: string;
  tokenAmountOutPercentageSelected: string;

  get tokenInAmount(): FormControl {
    return this.form.get('tokenInAmount') as FormControl;
  }

  get tokenOutAmount(): FormControl {
    return this.form.get('tokenOutAmount') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    protected _injector: Injector,
    private _blocksService: BlocksService,
    private _tokensService: TokensService,
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
      tokenInAmount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      tokenOutAmount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
    });

    this.tokenInChanges$ = this.tokenInAmount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.tokenInExact = true),
        switchMap((value: string) => this.amountOutQuote(value)),
        filter(quote => quote.amountOut !== '0'),
        tap((value: ISwapAmountOutQuoteResponse) => this.tokenOutAmount.setValue(value.amountOut, { emitEvent: false })),
        tap(_ => this.calcTolerance()),
        filter(_ => this.context.wallet !== undefined),
        switchMap(() => this.validateAllowance())
      ).subscribe();

    this.tokenOutChanges$ = this.tokenOutAmount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.tokenInExact = false),
        switchMap((value: string) => this.amountInQuote(value)),
        filter(quote => quote.amountIn !== '0'),
        tap((value: ISwapAmountInQuoteResponse) => this.tokenInAmount.setValue(value.amountIn, { emitEvent: false })),
        tap(_ => this.calcTolerance()),
        filter(_ => this.context.wallet !== undefined),
        switchMap(() => this.validateAllowance())
      ).subscribe();

      this.latestSyncedBlock$ = this._blocksService.getLatestBlock$()
        .pipe(
          tap(block => this.latestBlock = block?.height),
          switchMap(_ => this.validateAllowance()))
        .subscribe();
  }

  ngOnChanges() {
    if (this.data?.pool) {
      this.tokenInDetails = this.data.pool.token.crs;
      this.tokenOutDetails = this.data.pool.token.src;
    } else {
      const topTokens = new TokensFilter({limit: 2, direction: 'DESC', orderBy: 'DailyPriceChangePercent'});
      this._tokensService.getTokens(topTokens)
        .pipe(take(1))
        .subscribe(response => {
          this.tokenInDetails = (response.results[0] || null) as IMarketToken;
          this.tokenOutDetails = (response.results[1] || null) as IMarketToken;
        })
    }
  }

  selectInputToken(tokenAddress: string) {
    this.changeTokenIn = false;
    this.tokenAmountInPercentageSelected = null;

    if (tokenAddress?.length > 0) {
      this._tokensService.getToken(tokenAddress).pipe(take(1))
        .subscribe(token => {
          this.tokenInDetails = token as IMarketToken;
          this.quoteChangeToken();
        });
    }
  }

  selectOutputToken(tokenAddress: string) {
    this.changeTokenOut = false;
    this.tokenAmountOutPercentageSelected = null;

    if (tokenAddress?.length > 0) {
      this._tokensService.getToken(tokenAddress).pipe(take(1))
        .subscribe(token => {
          this.tokenOutDetails = token as IMarketToken;
          this.quoteChangeToken();
        });
    }
  }

  quoteChangeToken() {
    if (this.tokenInExact) {
      this.amountOutQuote(this.tokenInAmount.value)
        .pipe(
          filter(quote => quote.amountOut !== '0'),
          tap((quote: ISwapAmountOutQuoteResponse) => this.tokenOutAmount.setValue(quote.amountOut, { emitEvent: false })),
          tap(_ => this.calcTolerance()),
          switchMap(() => this.validateAllowance()),
          take(1)).subscribe();
    } else {
      this.amountInQuote(this.tokenOutAmount.value)
        .pipe(
          filter(quote => quote.amountIn !== '0'),
          tap((quote: ISwapAmountInQuoteResponse) => this.tokenInAmount.setValue(quote.amountIn, { emitEvent: false })),
          tap(_ => this.calcTolerance()),
          switchMap(() => this.validateAllowance()),
          take(1)).subscribe();
    }
  }

  changeToken(tokenField: string): void {
    if (tokenField === 'tokenIn') this.changeTokenIn = true;
    else this.changeTokenOut = true;
  }

  submit() {
    const payload: ISwapRequest = new SwapRequest({
      tokenOut: this.tokenOutDetails.address,
      tokenInAmount: this.tokenInAmount.value,
      tokenOutAmount: this.tokenOutAmount.value,
      tokenInExactAmount: this.tokenInExact,
      recipient: this.context.wallet,
      tokenInMaximumAmount: this.tokenInMax,
      tokenOutMinimumAmount: this.tokenOutMin,
      deadline: this.calcDeadline(this.deadlineThreshold)
    });

    if(payload.isValid){
      this._platformApi
        .swapQuote(this.tokenInDetails.address, payload)
          .pipe(take(1))
          .subscribe((quote: ITransactionQuote) => this.quote(quote));
    }
  }

  switch() {
    const tokenInAmount = this.tokenInAmount.value;
    const tokenOutAmount = this.tokenOutAmount.value;
    const tokenInDetails = this.tokenInDetails;
    const tokenOutDetails = this.tokenOutDetails;
    const tokenInPercentageSelection = this.tokenAmountInPercentageSelected;
    const tokenOutPercentageSelection = this.tokenAmountOutPercentageSelected;

    this.tokenInDetails = tokenOutDetails;
    this.tokenOutDetails = tokenInDetails;

    this.tokenAmountOutPercentageSelected = tokenInPercentageSelection;
    this.tokenAmountInPercentageSelected = tokenOutPercentageSelection;

    if (this.tokenInExact) {
      this.tokenInExact = false;
      this.tokenOutAmount.setValue(tokenInAmount, { emitEvent: false });

      this.amountInQuote(tokenInAmount)
        .pipe(
          filter(quote => quote.amountIn !== '0'),
          tap((quote: ISwapAmountInQuoteResponse) => this.tokenInAmount.setValue(quote.amountIn, { emitEvent: false })),
          tap(_ => this.calcTolerance()),
          switchMap(() => this.validateAllowance()),
          take(1)
        ).subscribe();
    } else {
      this.tokenInExact = true;
      this.tokenInAmount.setValue(tokenOutAmount, { emitEvent: false });

      this.amountOutQuote(tokenOutAmount)
        .pipe(
          filter(quote => quote.amountOut !== '0'),
          tap((quote: ISwapAmountOutQuoteResponse) => this.tokenOutAmount.setValue(quote.amountOut, { emitEvent: false })),
          tap(_ => this.calcTolerance()),
          switchMap(() => this.validateAllowance()),
          take(1)
        ).subscribe();
    }
  }

  private amountInQuote(amountOut: string): Observable<ISwapAmountInQuoteResponse> {
    const fallback = { amountIn: '0' } as ISwapAmountInQuoteResponse;

    if (!this.tokenInDetails || !this.tokenOutDetails) return of(fallback);

    const amountOutFixed = new FixedDecimal(amountOut, this.tokenOutDetails.decimals);

    if (amountOutFixed.isZero) return of(fallback);

    const payload = new SwapAmountInQuoteRequest(this.tokenOutDetails.address, amountOutFixed.formattedValue);

    return this._platformApi.swapAmountInQuote(this.tokenInDetails.address, payload).pipe(catchError(() => of(fallback)));
  }

  private amountOutQuote(amountIn: string): Observable<ISwapAmountOutQuoteResponse> {
    const fallback = { amountOut: '0' } as ISwapAmountOutQuoteResponse;

    if (!this.tokenInDetails || !this.tokenOutDetails) return of(fallback);

    const amountInFixed = new FixedDecimal(amountIn, this.tokenInDetails.decimals);

    const payload = new SwapAmountOutQuoteRequest(this.tokenInDetails.address, amountInFixed.formattedValue);

    if (amountInFixed.isZero) return of(fallback);

    return this._platformApi.swapAmountOutQuote(this.tokenOutDetails.address, payload).pipe(catchError(() => of(fallback)));
  }

  private validateAllowance(): Observable<AllowanceValidation> {
    if (!this.tokenInDetails || !this.tokenOutDetails || this.tokenInDetails.address === 'CRS' || !this.context?.wallet || !this.tokenInAmount.value) {
      this.allowance = null;
      return of(null);
    }

    const spender = this._env.routerAddress;

    return this._platformApi.getAllowance(this.context.wallet, spender, this.tokenInDetails.address)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, this.tokenInAmount.value, this.tokenInDetails)),
        tap((rsp: AllowanceValidation) => this.allowance = rsp));
  }

  calcTolerance(tolerance?: number) {
    if (tolerance) this.toleranceThreshold = tolerance;

    if (this.toleranceThreshold > 99.99 || this.toleranceThreshold < .01) return;
    if (!this.tokenInAmount.value || !this.tokenInAmount.value) return;

    const tokenInDecimals = this.tokenInDetails.decimals;
    const tokenOutDecimals = this.tokenOutDetails.decimals;

    const tokenInAmount = new FixedDecimal(this.tokenInAmount.value, tokenInDecimals);
    const tokenInPrice = new FixedDecimal(this.tokenInDetails.summary.priceUsd.toString(), 8);
    const tokenInTolerance = new FixedDecimal((1 + (this.toleranceThreshold / 100)).toFixed(8), 8);

    this.tokenInMax = MathService.multiply(tokenInAmount, tokenInTolerance);
    const tokenInMax = new FixedDecimal(this.tokenInMax, tokenInDecimals);

    const tokenOutAmount = new FixedDecimal(this.tokenOutAmount.value, tokenOutDecimals);
    const tokenOutPrice = new FixedDecimal(this.tokenOutDetails.summary.priceUsd.toString(), 8);
    const tokenOutTolerancePercentage = new FixedDecimal((this.toleranceThreshold / 100).toFixed(8), 8);
    const tokenOutToleranceAmount = MathService.multiply(tokenOutAmount, tokenOutTolerancePercentage);

    const tokenOutTolerance = new FixedDecimal(tokenOutToleranceAmount, tokenOutDecimals);

    this.tokenOutMin = MathService.subtract(tokenOutAmount, tokenOutTolerance);
    const tokenOutMin = new FixedDecimal(this.tokenOutMin, tokenOutDecimals);

    this.tokenInFiatValue = MathService.multiply(tokenInAmount, tokenInPrice);
    this.tokenOutFiatValue = MathService.multiply(tokenOutAmount, tokenOutPrice);
    this.tokenInMaxFiatValue = MathService.multiply(tokenInMax, tokenInPrice);
    this.tokenOutMinFiatValue = MathService.multiply(tokenOutMin, tokenOutPrice);
  }

  toggleShowMore(value: boolean) {
    this.showMore = value;
  }

  calcDeadline(minutes: number): number {
    this.deadlineThreshold = minutes;
    const blocks = Math.ceil(60 * minutes / 16);

    return blocks + this.latestBlock;
  }

  handlePercentageSelect(field: string, value: any) {
    if (field === 'amountIn') {
      this.tokenAmountOutPercentageSelected = null;
      this.tokenAmountInPercentageSelected = value.percentageOption;
      this.tokenInAmount.setValue(value.result, {emitEvent: true});
    } else {
      this.tokenAmountOutPercentageSelected = value.percentageOption;
      this.tokenAmountInPercentageSelected = null;
      this.tokenOutAmount.setValue(value.result, {emitEvent: true});
    }
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
    if (this.tokenInChanges$) this.tokenInChanges$.unsubscribe();
    if (this.tokenOutChanges$) this.tokenOutChanges$.unsubscribe();
    if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
    if (this.latestSyncedBlock$) this.latestSyncedBlock$.unsubscribe();
  }
}
