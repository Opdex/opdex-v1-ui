import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { ISwapAmountInQuoteResponse } from '@sharedModels/platform-api/responses/tokens/swap-amount-in-quote-response.interface';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, ElementRef, Input, OnDestroy, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, of, Observable } from 'rxjs';
import { debounceTime, take, distinctUntilChanged, switchMap, map, tap, catchError, filter, startWith } from 'rxjs/operators';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Icons } from 'src/app/enums/icons';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { TxBase } from '../tx-base.component';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ISwapRequest, SwapRequest } from '@sharedModels/platform-api/requests/tokens/swap-request';
import { SwapAmountInQuoteRequest } from '@sharedModels/platform-api/requests/tokens/swap-amount-in-quote-request';
import { SwapAmountOutQuoteRequest } from '@sharedModels/platform-api/requests/tokens/swap-amount-out-quote-request';
import { ISwapAmountOutQuoteResponse } from '@sharedModels/platform-api/responses/tokens/swap-amount-out-quote-response.interface';
import { TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { CollapseAnimation } from '@sharedServices/animations/collapse';

@Component({
  selector: 'opdex-tx-swap',
  templateUrl: './tx-swap.component.html',
  styleUrls: ['./tx-swap.component.scss'],
  animations: [CollapseAnimation]
})
export class TxSwapComponent extends TxBase implements OnDestroy {
  @ViewChild('tokenInInput') tokenInInput: ElementRef;
  @ViewChild('tokenOutInput') tokenOutInput: ElementRef;

  @Input() data: any;
  icons = Icons;
  iconSizes = IconSizes;
  tokenInExact = true;
  form: FormGroup;
  tokenInChanges$: Subscription;
  tokenOutChanges$: Subscription;
  tokenInDetails: any;
  tokenOutDetails: any;
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
  tokens: IToken[];
  filteredTokenIn$: Observable<IToken[]>;
  filteredTokenOut$: Observable<IToken[]>;
  changeTokenIn: boolean;
  changeTokenOut: boolean;
  allowanceTransaction$: Subscription;
  latestSyncedBlock$: Subscription;
  latestBlock: number;
  tokenAmountInPercentageSelected: string;
  tokenAmountOutPercentageSelected: string;

  get tokenInAmount(): FormControl {
    return this.form.get('tokenInAmount') as FormControl;
  }

  get tokenIn(): FormControl {
    return this.form.get('tokenIn') as FormControl;
  }

  get tokenOutAmount(): FormControl {
    return this.form.get('tokenOutAmount') as FormControl;
  }

  get tokenOut(): FormControl {
    return this.form.get('tokenOut') as FormControl;
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
      tokenIn: [null, [Validators.required]],
      tokenOutAmount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      tokenOut: [null, [Validators.required]]
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

      this.tokens$ = this._tokensService
        .getTokens(new TokensFilter({limit: 25, direction: "DESC"}))
        .pipe(map(tokens => {
          this.tokens = tokens.results;
          return tokens.results;
        }));

      this.filteredTokenIn$ = this.tokenIn.valueChanges
        .pipe(
          startWith(''),
          map((token: string) => token ? this._filterPublicKeys(token) : this.tokens.slice()));

      this.filteredTokenOut$ = this.tokenOut.valueChanges
        .pipe(
          startWith(''),
          map((token: string) => token ? this._filterPublicKeys(token) : this.tokens.slice()));
  }

  ngOnChanges() {
    if (this.data?.pool) {
      this.tokenInDetails = this.data.pool.token.crs;
      this.tokenOutDetails = this.data.pool.token.src;

      this.tokenIn.setValue(this.tokenInDetails.address);
      this.tokenOut.setValue(this.tokenOutDetails.address);
    }
  }

  selectInputToken($event?: MatAutocompleteSelectedEvent) {
    this.changeTokenIn = false;

    if ($event) {
      this._tokensService.getToken($event.option.value).pipe(take(1))
        .subscribe(token => {
          this.tokenInDetails = token;
          this.quoteChangeToken();
        });
    }
  }

  selectOutputToken($event?: MatAutocompleteSelectedEvent) {
    this.changeTokenOut = false;

    if ($event) {
      this._tokensService.getToken($event.option.value).pipe(take(1))
        .subscribe(token => {
          this.tokenOutDetails = token;
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
    if (tokenField === 'tokenIn') {
      this.changeTokenIn = true;
      setTimeout(() => this.tokenInInput.nativeElement.focus());
    } else {
      this.changeTokenOut = true;
      setTimeout(() => this.tokenOutInput.nativeElement.focus());
    }
  }

  submit() {
    const payload: ISwapRequest = new SwapRequest({
      tokenOut: this.tokenOut.value,
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
        .swapQuote(this.tokenIn.value, payload)
          .pipe(take(1))
          .subscribe((quote: ITransactionQuote) => this.quote(quote));
    }
  }

  switch() {
    const tokenInAmount = this.tokenInAmount.value;
    const tokenIn = this.tokenIn.value;
    const tokenOutAmount = this.tokenOutAmount.value;
    const tokenOut = this.tokenOut.value;
    const tokenInDetails = this.tokenInDetails;
    const tokenOutDetails = this.tokenOutDetails;
    const tokenInPercentageSelection = this.tokenAmountInPercentageSelected;
    const tokenOutPercentageSelection = this.tokenAmountOutPercentageSelected;

    this.tokenInDetails = tokenOutDetails;
    this.tokenOutDetails = tokenInDetails;

    this.tokenAmountOutPercentageSelected = tokenInPercentageSelection;
    this.tokenAmountInPercentageSelected = tokenOutPercentageSelection;

    this.tokenIn.setValue(tokenOut, { emitEvent: false });
    this.tokenOut.setValue(tokenIn, { emitEvent: false });

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
    const spender = this._env.routerAddress;

    if (this.tokenIn.value === 'CRS' || !this.context?.wallet || !this.tokenInAmount.value) {
      this.allowance = null;
      return of(null);
    }

    return this._platformApi.getAllowance(this.context.wallet, spender, this.tokenIn.value)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, this.tokenInAmount.value, this.tokenInDetails)),
        tap((rsp: AllowanceValidation) => this.allowance = rsp));
  }

  private _filterPublicKeys(value: string): IToken[] {
    if (!value) [];

    const filterValue = value.toString().toLowerCase();

    return this.tokens.filter(token => {
      var addressMatch = token.address.toLowerCase().includes(filterValue);
      var symbolMatch = token.symbol.toLowerCase().includes(filterValue);
      var nameMatch = token.name.toLowerCase().includes(filterValue);

      return addressMatch || nameMatch || symbolMatch;
    });
  }

  calcTolerance(tolerance?: number) {
    if (tolerance) this.toleranceThreshold = tolerance;

    if (this.toleranceThreshold > 99.99 || this.toleranceThreshold < .01) return;
    if (!this.tokenInAmount.value || !this.tokenInAmount.value) return;

    const tokenInDecimals = this.tokenInDetails.decimals;
    const tokenOutDecimals = this.tokenOutDetails.decimals;

    const tokenInAmount = new FixedDecimal(this.tokenInAmount.value, tokenInDecimals);
    const tokenInPrice = new FixedDecimal(this.tokenInDetails.summary.priceUsd, 8);
    const tokenInTolerance = new FixedDecimal((1 + (this.toleranceThreshold / 100)).toFixed(8), 8);

    this.tokenInMax = MathService.multiply(tokenInAmount, tokenInTolerance);
    const tokenInMax = new FixedDecimal(this.tokenInMax, tokenInDecimals);

    const tokenOutAmount = new FixedDecimal(this.tokenOutAmount.value, tokenOutDecimals);
    const tokenOutPrice = new FixedDecimal(this.tokenOutDetails.summary.priceUsd, 8);
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
