import { SwapQuoteService } from '@sharedServices/utility/swap-quote.service';
import { ILiquidityPoolResponse, ILiquidityPoolsResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { LiquidityPoolsFilter, ILiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { TokenAttributes, TokenOrderByTypes, TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { ISwapAmountInQuoteResponse } from '@sharedModels/platform-api/responses/tokens/swap-amount-in-quote-response.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Input, OnDestroy, Injector, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, of, Observable } from 'rxjs';
import { debounceTime, take, switchMap, map, tap, catchError, filter } from 'rxjs/operators';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Icons } from 'src/app/enums/icons';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { TxBase } from '../tx-base.component';
import { IMarketToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { SwapRequest } from '@sharedModels/platform-api/requests/tokens/swap-request';
import { SwapAmountInQuoteRequest } from '@sharedModels/platform-api/requests/tokens/swap-amount-in-quote-request';
import { SwapAmountOutQuoteRequest } from '@sharedModels/platform-api/requests/tokens/swap-amount-out-quote-request';
import { ISwapAmountOutQuoteResponse } from '@sharedModels/platform-api/responses/tokens/swap-amount-out-quote-response.interface';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { CollapseAnimation } from '@sharedServices/animations/collapse';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';

@Component({
  selector: 'opdex-tx-swap',
  templateUrl: './tx-swap.component.html',
  styleUrls: ['./tx-swap.component.scss'],
  animations: [CollapseAnimation]
})
export class TxSwapComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data: any;
  icons = Icons;
  iconSizes = IconSizes;
  tokenInExact = true;
  form: FormGroup;
  tokenIn: IMarketToken;
  tokenInMax: FixedDecimal;
  tokenInFiatValue: FixedDecimal;
  tokenInMaxFiatValue: FixedDecimal;
  tokenInPercentageSelected: string;
  changeTokenIn: boolean;
  tokenOut: IMarketToken;
  tokenOutMin: FixedDecimal;
  tokenOutFiatValue: FixedDecimal;
  tokenOutMinFiatValue: FixedDecimal;
  tokenOutPercentageSelected: string;
  tokenOutFiatPercentageDifference: FixedDecimal;
  priceImpact: FixedDecimal;
  numInPerOneOut: FixedDecimal;
  changeTokenOut: boolean;
  toleranceThreshold: number;
  deadlineThreshold: number;
  deadlineBlock: number;
  allowance: AllowanceValidation;
  transactionTypes = AllowanceRequiredTransactionTypes;
  showMore: boolean;
  latestBlock: number;
  balanceError: boolean;
  subscription = new Subscription();
  poolIn: ILiquidityPoolResponse;
  poolOut: ILiquidityPoolResponse;

  get tokenInAmount(): FormControl {
    return this.form.get('tokenInAmount') as FormControl;
  }

  get tokenOutAmount(): FormControl {
    return this.form.get('tokenOutAmount') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    private _indexService: IndexService,
    private _tokensService: TokensService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _env: EnvironmentsService,
    protected _injector: Injector
  ) {
    super(_injector);

    this.deadlineThreshold = this.context?.preferences?.deadlineThreshold || 10;
    this.toleranceThreshold = this.context?.preferences?.toleranceThreshold || 0.1;

    this.form = this._fb.group({
      tokenInAmount: ['', [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]],
      tokenOutAmount: ['', [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]],
    });

    this.subscription.add(
      this.tokenInAmount.valueChanges
        .pipe(
          debounceTime(400),
          // distinctUntilChanged(),
          tap(_ => this.tokenInExact = true),
          switchMap((value: string) => this.amountOutQuote(value)),
          switchMap(_ => this.validateBalance()))
        .subscribe());

    this.subscription.add(
      this.tokenOutAmount.valueChanges
        .pipe(
          debounceTime(400),
          // distinctUntilChanged(),
          tap(_ => this.tokenInExact = false),
          switchMap((value: string) => this.amountInQuote(value)),
          switchMap(_ => this.validateBalance()))
        .subscribe());

    this.subscription.add(
      this._indexService.getLatestBlock$()
        .pipe(
          tap(block => this.latestBlock = block?.height),
          tap(_ => this.calcDeadline(this.deadlineThreshold)),
          filter(_ => !!this.tokenIn && !!this.tokenOut),
          switchMap(_ => this.refreshTokens(this.tokenIn.address, this.tokenOut.address)),
          switchMap(_ => this.tokenInExact ? this.amountOutQuote(this.tokenInAmount.value) : this.amountInQuote(this.tokenOutAmount.value)),
          switchMap(_ => this.validateBalance()))
        .subscribe());
  }

  ngOnChanges() {
    if (this.data?.pool) {
      this.tokenIn = this.data.pool.tokens.src;
      this.tokenOut = this.data.pool.tokens.crs;
      this.poolIn = this.data.pool;
      this.poolOut = this.data.pool;
    } else {
      const topTokens = new TokensFilter({
        limit: 2,
        direction: 'DESC',
        orderBy: TokenOrderByTypes.DailyPriceChangePercent,
        includeZeroLiquidity: false,
        tokenAttributes: [TokenAttributes.NonProvisional]
      });
      this._tokensService.getTokens(topTokens)
        .pipe(take(1))
        .subscribe(response => {
          if (response?.results?.length >= 2) {
            this.tokenIn = response.results[0] as IMarketToken;
            this.tokenOut = response.results[1] as IMarketToken;
          }
        });
    }
  }

  selectToken(tokenField: string, token: IToken): void {
    const isTokenInField = tokenField === 'tokenIn';

    if (isTokenInField) {
      this.changeTokenIn = false;
      this.tokenInPercentageSelected = null;
    } else {
      this.changeTokenOut = false;
      this.tokenOutPercentageSelected = null;
    }

    if (!!token) {
      if (isTokenInField) this.tokenIn = token as IMarketToken;
      else this.tokenOut = token as IMarketToken;

      this.allowance = null;

      this.tokenInExact
        ? this.amountOutQuote(this.tokenInAmount.value).pipe(take(1)).subscribe()
        : this.amountInQuote(this.tokenOutAmount.value).pipe(take(1)).subscribe();
    }
  }

  changeToken(tokenField: string): void {
    if (tokenField === 'tokenIn') this.changeTokenIn = true;
    else this.changeTokenOut = true;
  }

  submit() {
    this.calcDeadline(this.deadlineThreshold);
    const tokenInAmount = new FixedDecimal(this.tokenInAmount.value, this.tokenIn.decimals);
    const tokenOutAmount = new FixedDecimal(this.tokenOutAmount.value, this.tokenOut.decimals);
    const tokenInMax = this.tokenInExact ? tokenInAmount : this.tokenInMax;
    const tokenOutMin = !this.tokenInExact ? tokenOutAmount : this.tokenOutMin;

    const request = new SwapRequest(
      this.tokenOut.address,
      tokenInAmount,
      tokenOutAmount,
      tokenInMax,
      tokenOutMin,
      this.tokenInExact,
      this.context.wallet,
      this.deadlineBlock
    );

    this._platformApi
      .swapQuote(this.tokenIn.address, request.payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote),
                   (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  switch() {
    const tokenInAmount = this.tokenInAmount.value;
    const tokenOutAmount = this.tokenOutAmount.value;
    const tokenIn = this.tokenIn;
    const tokenOut = this.tokenOut;
    const tokenInPercentageSelection = this.tokenInPercentageSelected;
    const tokenOutPercentageSelection = this.tokenOutPercentageSelected;

    this.tokenIn = tokenOut;
    this.tokenOut = tokenIn;
    this.tokenOutPercentageSelected = tokenInPercentageSelection;
    this.tokenInPercentageSelected = tokenOutPercentageSelection;

    if (this.tokenInExact) {
      this.tokenInExact = false;
      this.tokenOutAmount.setValue(tokenInAmount, { emitEvent: false });
      this.amountInQuote(tokenInAmount).pipe(take(1)).subscribe();
    } else {
      this.tokenInExact = true;
      this.tokenInAmount.setValue(tokenOutAmount, { emitEvent: false });
      this.amountOutQuote(tokenOutAmount).pipe(take(1)).subscribe();
    }
  }

  calcTotals(tolerance?: number): void {
    if (tolerance) this.toleranceThreshold = tolerance;
    if (this.toleranceThreshold > 99.99 || this.toleranceThreshold < .01) return;
    if (!this.tokenInAmount.value || !this.tokenInAmount.value) return;
    if (!this.poolIn || !this.poolOut) return;

    const one = FixedDecimal.One(8);
    const negativeOneHundred = FixedDecimal.NegativeOneHundred(8);
    const tokenInAmount = new FixedDecimal(this.tokenInAmount.value, this.tokenIn.decimals);
    const tokenInPrice = new FixedDecimal(this.tokenIn.summary.priceUsd.toString(), 8);
    const tokenInTolerance = new FixedDecimal((1 + (this.toleranceThreshold / 100)).toFixed(8), 8);
    const tokenOutAmount = new FixedDecimal(this.tokenOutAmount.value, this.tokenOut.decimals);
    const tokenOutPrice = new FixedDecimal(this.tokenOut.summary.priceUsd.toString(), 8);
    const tokenOutTolerancePercentage = new FixedDecimal((this.toleranceThreshold / 100).toFixed(8), 8);
    const tokenOutTolerance = tokenOutAmount.multiply(tokenOutTolerancePercentage);

    this.tokenInMax = tokenInAmount.multiply(tokenInTolerance);
    this.tokenOutMin = tokenOutAmount.subtract(tokenOutTolerance);
    this.tokenInFiatValue = tokenInAmount.multiply(tokenInPrice);
    this.tokenOutFiatValue = tokenOutAmount.multiply(tokenOutPrice);
    this.tokenInMaxFiatValue = this.tokenInMax.multiply(tokenInPrice);
    this.tokenOutMinFiatValue = this.tokenOutMin.multiply(tokenOutPrice);
    this.priceImpact = this.getPriceImpact(tokenInAmount, tokenOutAmount);
    this.numInPerOneOut = tokenInAmount.divide(tokenOutAmount);
    // console.log('price impact: ', this.priceImpact.formattedValue);

    // (1 - (amountOut / amountIn)) * -100
    this.tokenOutFiatPercentageDifference = one.subtract(this.tokenOutFiatValue.divide(this.tokenInFiatValue)).multiply(negativeOneHundred);
  }

  getPriceImpact(tokenInAmount: FixedDecimal, tokenOutAmount: FixedDecimal): FixedDecimal {
    const isSrcToSrc = this.tokenIn.address !== 'CRS' && this.tokenOut.address !== 'CRS';
    const isCrsToSrc = !isSrcToSrc && this.tokenIn.address === 'CRS';
    const isSrcToCrs = !isSrcToSrc && !isCrsToSrc;
    const pool0CrsReserves = new FixedDecimal(this.poolIn.summary.reserves.crs, this.poolIn.tokens.crs.decimals);
    const pool0SrcReserves = new FixedDecimal(this.poolIn.summary.reserves.src, this.poolIn.tokens.src.decimals);
    const pool1CrsReserves = new FixedDecimal(this.poolOut.summary.reserves.crs, this.poolOut.tokens.crs.decimals);
    const pool1SrcReserves = new FixedDecimal(this.poolOut.summary.reserves.src, this.poolOut.tokens.src.decimals);
    let updatedCrsReserves: FixedDecimal;
    let updatedSrcReserves: FixedDecimal;

    if (isSrcToSrc) {
      const quote = this.tokenInExact
        ? SwapQuoteService.getAmountOutMulti(tokenInAmount, pool0CrsReserves, pool0SrcReserves, pool1CrsReserves, pool1SrcReserves, new FixedDecimal('0.003', 3))
        : SwapQuoteService.getAmountInMulti(tokenOutAmount, pool1CrsReserves, pool1SrcReserves, pool0CrsReserves, pool0SrcReserves, new FixedDecimal('0.003', 3));

      updatedCrsReserves = pool0CrsReserves.subtract(quote[0].amountOut);
      updatedSrcReserves = pool0SrcReserves.add(quote[0].amountIn);
    } else {
      if (this.tokenInExact) {
        if (isCrsToSrc) {
          const quote = SwapQuoteService.getAmountOut(tokenInAmount, pool0CrsReserves, pool0SrcReserves, new FixedDecimal('0.003', 3));
          updatedCrsReserves = pool0CrsReserves.add(quote.amountIn);
          updatedSrcReserves = pool0SrcReserves.subtract(quote.amountOut);
        } else {
          const quote = SwapQuoteService.getAmountOut(tokenInAmount, pool0SrcReserves, pool0CrsReserves, new FixedDecimal('0.003', 3));
          updatedSrcReserves = pool0SrcReserves.add(quote.amountIn);
          updatedCrsReserves = pool0CrsReserves.subtract(quote.amountOut);
        }
      } else {
        if (isCrsToSrc) {
          const quote = SwapQuoteService.getAmountIn(tokenOutAmount, pool0CrsReserves, pool0SrcReserves, new FixedDecimal('0.003', 3));
          updatedCrsReserves = pool0CrsReserves.add(quote.amountIn);
          updatedSrcReserves = pool0SrcReserves.subtract(quote.amountOut);
        } else {
          const quote = SwapQuoteService.getAmountIn(tokenOutAmount, pool0SrcReserves, pool0CrsReserves, new FixedDecimal('0.003', 3));
          updatedSrcReserves = pool0SrcReserves.add(quote.amountIn);
          updatedCrsReserves = pool0CrsReserves.subtract(quote.amountOut);
        }
      }
    }

    let previousAmountInPerAmountOut: FixedDecimal;
    let currentAmountInPerAmountOut: FixedDecimal;

    if (isSrcToCrs || isSrcToSrc) {
      previousAmountInPerAmountOut = new FixedDecimal(this.poolIn.summary.cost.crsPerSrc, this.poolIn.tokens.crs.decimals);
      currentAmountInPerAmountOut = updatedCrsReserves.divide(updatedSrcReserves);
    } else {
      previousAmountInPerAmountOut = new FixedDecimal(this.poolIn.summary.cost.srcPerCrs, this.poolIn.tokens.src.decimals);
      currentAmountInPerAmountOut = updatedSrcReserves.divide(updatedCrsReserves);
    }

    console.log('currentAmountInPerAmountOut: ', currentAmountInPerAmountOut.formattedValue);
    console.log('previousAmountInPerAmountOut: ', previousAmountInPerAmountOut.formattedValue);
    console.log('difference original: ', currentAmountInPerAmountOut.divide(previousAmountInPerAmountOut).formattedValue)
    // console.log('difference updated: ', previousAmountInPerAmountOut.divide(currentAmountInPerAmountOut).formattedValue)

    const difference = currentAmountInPerAmountOut.divide(previousAmountInPerAmountOut);


    const one = FixedDecimal.One(8);
    const negativeOneHundred = FixedDecimal.NegativeOneHundred(8);
    // const oneHundred = FixedDecimal.OneHundred(8);

    console.log('friendly final * -100: ', one.subtract(difference).multiply(negativeOneHundred).formattedValue);
    // console.log('friendly final * 100: ', one.subtract(difference).multiply(oneHundred).formattedValue)

    return one.subtract(difference).multiply(negativeOneHundred);
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore;
  }

  calcDeadline(minutes: number): void {
    this.deadlineThreshold = minutes;

    // console.log(this.deadlineThreshold)
    const blocks = Math.ceil(60 * minutes / 16);
    this.deadlineBlock = blocks + this.latestBlock;
  }

  handlePercentageSelect(field: string, value: any): void {
    if (field === 'amountIn') {
      if (this.tokenInPercentageSelected === value.percentageOption && this.tokenInAmount.value === value.result) {
        return;
      }

      this.tokenOutPercentageSelected = null;
      this.tokenInPercentageSelected = value.percentageOption;
      this.tokenInAmount.setValue(value.result, {emitEvent: true});
    } else {
      if (this.tokenOutPercentageSelected === value.percentageOption && this.tokenOutAmount.value === value.result) {
        return;
      }

      this.tokenOutPercentageSelected = value.percentageOption;
      this.tokenInPercentageSelected = null;
      this.tokenOutAmount.setValue(value.result, {emitEvent: true});
    }
  }

  private resetValues(isAmountInQuote: boolean) {
    // If "isAmountInQuote" reset amountOut or vice versa
    // This lets users put "0" or "." in the AmountOut field, resulting in an "AmountIn" quote
    // Then the AmountOut field is not cleared, maintaining the "0" or "." and the AmountOut is cleared.
    if (isAmountInQuote) this.tokenInAmount.setValue('', { emitEvent: false });
    else this.tokenOutAmount.setValue('', { emitEvent: false });

    this.tokenInMax = null;
    this.tokenInFiatValue = null;
    this.tokenInMaxFiatValue = null;
    this.tokenOutMin = null;
    this.tokenOutFiatValue = null;
    this.tokenOutMinFiatValue = null;
    this.tokenOutFiatPercentageDifference = null;
  }

  private amountInQuote(amountOut: string): Observable<boolean> {
    if (!this.tokenIn || !this.tokenOut) return of(false);

    const amountOutFixed = new FixedDecimal(amountOut, this.tokenOut.decimals);

    if (amountOutFixed.isZero) {
      this.resetValues(true);
      return of(false);
    }

    const request = new SwapAmountInQuoteRequest(this.tokenOut.address, amountOutFixed);

    return this._platformApi
      .swapAmountInQuote(this.tokenIn.address, request.payload)
      .pipe(
        catchError(() => {
          this.tokenOutAmount.setErrors({ invalidAmountInQuote: true });
          return of();
        }),
        filter(quote => quote !== null && quote !== undefined),
        tap((value: ISwapAmountInQuoteResponse) => this.tokenInAmount.setValue(value.amountIn, { emitEvent: false })),
        tap(_ => this.calcTotals()),
        filter(_ => this.context.wallet !== undefined),
        switchMap(() => this.validateAllowance()));
  }

  private amountOutQuote(amountIn: string): Observable<boolean> {
    if (!this.tokenIn || !this.tokenOut) return of(false);

    const amountInFixed = new FixedDecimal(amountIn, this.tokenIn.decimals);

    if (amountInFixed.isZero) {
      this.resetValues(false);
      return of(false);
    }

    const request = new SwapAmountOutQuoteRequest(this.tokenIn.address, amountInFixed);

    return this._platformApi.swapAmountOutQuote(this.tokenOut.address, request.payload)
      .pipe(
        catchError(() => {
          this.tokenInAmount.setErrors({ invalidAmountOutQuote: true });
          return of();
        }),
        filter(quote => quote !== null && quote !== undefined),
        tap((value: ISwapAmountOutQuoteResponse) => this.tokenOutAmount.setValue(value.amountOut, { emitEvent: false })),
        tap(_ => this.calcTotals()),
        filter(_ => this.context.wallet !== undefined),
        switchMap(_ => this.validateAllowance()));
  }

  private validateAllowance(): Observable<boolean> {
    if (!this.tokenIn || !this.tokenOut || this.tokenIn.address === 'CRS' || !this.context?.wallet || !this.tokenInAmount.value) {
      this.allowance = null;
      return of(false);
    }

    return this._validateAllowance$(this.context.wallet, this._env.routerAddress, this.tokenIn, this.tokenInAmount.value)
      .pipe(
        tap((allowance: AllowanceValidation) => this.allowance = allowance),
        map((allowance: AllowanceValidation) => allowance.isApproved));
  }

  private validateBalance(): Observable<boolean> {
    if (!this.tokenIn || !this.tokenOut || !this.context?.wallet || !this.tokenInAmount.value) {
      return of(false);
    }

    const amountNeeded = this.tokenInExact
      ? new FixedDecimal(this.tokenInAmount.value, this.tokenIn.decimals)
      : this.tokenInMax;

    return this._validateBalance$(this.tokenIn, amountNeeded)
      .pipe(tap(result => this.balanceError = !result));
  }

  private refreshTokens(tokenIn: string, tokenOut: string): Observable<ILiquidityPoolsResponse> {
    let tokens = [];

    if (!!tokenIn && tokenIn !== 'CRS') tokens.push(tokenIn);
    if (!!tokenOut && tokenOut !== 'CRS') tokens.push(tokenOut);

    const request = new LiquidityPoolsFilter({
      market: this._env.marketAddress,
      tokens: tokens,
      limit: 2
    } as ILiquidityPoolsFilter);

    return this._liquidityPoolsService.getLiquidityPools(request)
      .pipe(
        tap((pools: ILiquidityPoolsResponse) => {
          this.poolIn = pools.results.find(pool => pool.tokens.crs.address === tokenIn || pool.tokens.src.address === tokenIn);
          this.poolOut = pools.results.find(pool => pool.tokens.crs.address === tokenOut || pool.tokens.src.address === tokenOut);
          this.tokenIn = (tokenIn === 'CRS' ? this.poolIn.tokens.crs : this.poolIn.tokens.src) as IMarketToken;
          this.tokenOut = (tokenOut === 'CRS' ? this.poolOut.tokens.crs : this.poolOut.tokens.src) as IMarketToken;
        }));
  }

  destroyContext$(): void {
    this.context$.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroyContext$();
    this.subscription.unsubscribe();
  }
}
