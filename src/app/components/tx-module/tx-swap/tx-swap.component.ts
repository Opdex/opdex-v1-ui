import { BlocksService } from '@sharedServices/platform/blocks.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, ElementRef, Input, OnDestroy, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, of, Observable, timer } from 'rxjs';
import { debounceTime, take, distinctUntilChanged, switchMap, map, tap, catchError, filter, startWith } from 'rxjs/operators';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { environment } from '@environments/environment';
import { Icons } from 'src/app/enums/icons';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { TxBase } from '../tx-base.component';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ISwapRequest, SwapRequest } from '@sharedModels/platform-api/requests/tokens/swap-request';
import { ISwapQuoteRequest } from '@sharedModels/platform-api/requests/quotes/swap-quote-request';

@Component({
  selector: 'opdex-tx-swap',
  templateUrl: './tx-swap.component.html',
  styleUrls: ['./tx-swap.component.scss']
})
export class TxSwapComponent extends TxBase implements OnDestroy {
  @ViewChild('tokenInInput') tokenInInput: ElementRef;
  @ViewChild('tokenOutInput') tokenOutInput: ElementRef;

  @Input() data: any;
  icons = Icons;
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
    private _blocksService: BlocksService
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
      tokenIn: ['CRS', [Validators.required]],
      tokenOutAmount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      tokenOut: [null, [Validators.required]]
    });

    this.tokenInChanges$ = this.tokenInAmount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.tokenInExact = true),
        switchMap((value) => this.amountQuote(value)),
        filter(quote => quote !== '0'),
        tap((value: string) => this.tokenOutAmount.setValue(value, { emitEvent: false })),
        tap(_ => this.calcTolerance()),
        filter(_ => this.context.wallet !== undefined),
        switchMap(() => this.validateAllowance())
      ).subscribe();

    this.tokenOutChanges$ = this.tokenOutAmount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.tokenInExact = false),
        switchMap((value: string) => this.amountQuote(value)),
        filter(quote => quote !== '0'),
        tap((value: string) => this.tokenInAmount.setValue(value, { emitEvent: false })),
        tap(_ => this.calcTolerance()),
        filter(_ => this.context.wallet !== undefined),
        switchMap(() => this.validateAllowance())
      ).subscribe();

      this.latestSyncedBlock$ = this._blocksService.getLatestBlock$()
        .pipe(
          tap(block => this.latestBlock = block?.height),
          switchMap(_ => this.validateAllowance()))
        .subscribe();

      this.tokens$ = this._platformApi
        .getTokens()
        .pipe(tap(tokens => this.tokens = tokens));

      this.filteredTokenIn$ = this.tokenIn.valueChanges
        .pipe(
          startWith(''),
          map((token: string) => token ? this._filterPublicKeys(token) : this.tokens.slice()));

      this.filteredTokenOut$ = this.tokenOut.valueChanges
        .pipe(
          startWith(''),
          map((token: string) => token ? this._filterPublicKeys(token) : this.tokens.slice()));
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

  ngOnChanges() {
    if (this.data?.pool) {
      this.tokenInDetails = this.data.pool.token.crs;
      this.tokenOutDetails = this.data.pool.token.src;

      this.tokenOut.setValue(this.tokenOutDetails.address);
    }
  }

  selectInputToken($event?: MatAutocompleteSelectedEvent) {
    this.changeTokenIn = false;

    if ($event) {
      this.tokenInDetails = this.tokens.find(t => t.address === $event.option.value);
      this.quoteChangeToken();
    }
  }

  selectOutputToken($event?: MatAutocompleteSelectedEvent) {
    this.changeTokenOut = false;

    if ($event) {
      this.tokenOutDetails = this.tokens.find(t => t.address === $event.option.value);
      this.quoteChangeToken();
    }
  }

  quoteChangeToken() {
    if (this.tokenInExact) {
      this.amountQuote(this.tokenInAmount.value)
        .pipe(
          filter(quote => quote !== '0'),
          tap((quote: string) => this.tokenOutAmount.setValue(quote, { emitEvent: false })),
          tap(_ => this.calcTolerance()),
          switchMap(() => this.validateAllowance()),
          take(1)).subscribe();
    } else {
      this.amountQuote(this.tokenOutAmount.value)
        .pipe(
          filter(quote => quote !== '0'),
          tap((quote: string) => this.tokenInAmount.setValue(quote, { emitEvent: false })),
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

    this.tokenInDetails = tokenOutDetails;
    this.tokenOutDetails = tokenInDetails;

    this.tokenIn.setValue(tokenOut, { emitEvent: false });
    this.tokenOut.setValue(tokenIn, { emitEvent: false });

    if (this.tokenInExact) {
      this.tokenInExact = false;
      this.tokenOutAmount.setValue(tokenInAmount, { emitEvent: false });
      this.amountQuote(tokenInAmount)
        .pipe(
          filter(quote => quote !== '0'),
          tap((quote: string) => this.tokenInAmount.setValue(quote, { emitEvent: false })),
          tap(_ => this.calcTolerance()),
          switchMap(() => this.validateAllowance()),
          take(1)
        ).subscribe();
    } else {
      this.tokenInExact = true;
      this.tokenInAmount.setValue(tokenOutAmount, { emitEvent: false });
      this.amountQuote(tokenOutAmount)
        .pipe(
          filter(quote => quote !== '0'),
          tap((quote: string) => this.tokenOutAmount.setValue(quote, { emitEvent: false })),
          tap(_ => this.calcTolerance()),
          switchMap(() => this.validateAllowance()),
          take(1)
        ).subscribe();
    }
  }

  amountQuote(value: string): Observable<string> {
    if (!value || value.replace('0', '') === '.') {
      return of('0');
    }

    const valueDecimals = this.tokenInExact ? this.tokenInDetails.decimals : this.tokenOutDetails.decimals;
    var fixedDecimalValue = new FixedDecimal(value, valueDecimals);

    const payload: ISwapQuoteRequest = {
      tokenIn: this.tokenInDetails.address,
      tokenOut: this.tokenOutDetails.address,
      tokenInAmount: this.tokenInExact ? fixedDecimalValue.formattedValue : null,
      tokenOutAmount: !this.tokenInExact ? fixedDecimalValue.formattedValue : null
    };

    if (fixedDecimalValue.isZero) return of('0');

    return this._platformApi.getSwapQuote(payload).pipe(catchError(() => of('0')));
  }

  validateAllowance(): Observable<AllowanceValidation> {
    const spender = environment.routerAddress;

    if (this.tokenIn.value === 'CRS' || !this.context?.wallet || !this.tokenInAmount.value) {
      return of(null);
    }

    return this._platformApi.getAllowance(this.context.wallet, spender, this.tokenIn.value)
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
    const tokenInPrice = new FixedDecimal(this.tokenInDetails.summary.price.close, 8);
    const tokenInTolerance = new FixedDecimal((1 + (this.toleranceThreshold / 100)).toFixed(8), 8);

    this.tokenInMax = MathService.multiply(tokenInAmount, tokenInTolerance);
    const tokenInMax = new FixedDecimal(this.tokenInMax, tokenInDecimals);

    const tokenOutAmount = new FixedDecimal(this.tokenOutAmount.value, tokenOutDecimals);
    const tokenOutPrice = new FixedDecimal(this.tokenOutDetails.summary.price.close, 8);
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
