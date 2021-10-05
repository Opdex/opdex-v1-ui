import { MathService } from '@sharedServices/utility/math.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, of, Observable } from 'rxjs';
import { debounceTime, take, distinctUntilChanged, switchMap, map, tap, catchError, filter, startWith } from 'rxjs/operators';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { environment } from '@environments/environment';
import { Icons } from 'src/app/enums/icons';
import { TransactionTypes } from 'src/app/enums/transaction-types';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';
import { TxBase } from '../tx-base.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { IToken } from '@sharedModels/responses/platform-api/tokens/token.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

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
  transactionTypes = TransactionTypes;
  showMore: boolean = false;
  tokenInFiatValue: string;
  tokenInMaxFiatValue: string;
  tokenOutFiatValue: string;
  tokenOutMinFiatValue: string;
  setTolerance = 0.1;
  tokenInMax: string;
  tokenOutMin: string;
  tokens$: Observable<IToken[]>;
  tokens: IToken[];
  filteredTokenIn$: Observable<IToken[]>;
  filteredTokenOut$: Observable<IToken[]>;
  changeTokenIn: boolean;
  changeTokenOut: boolean;

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

  get deadline(): FormControl {
    return this.form.get('deadline') as FormControl;
  }

  get tolerance(): FormControl {
    return this.form.get('tolerance') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    private _math: MathService,
    protected _dialog: MatDialog,
    protected _userContext: UserContextService,
    protected _bottomSheet: MatBottomSheet
  ) {
    super(_userContext, _dialog, _bottomSheet);

    this.form = this._fb.group({
      tokenInAmount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      tokenIn: ['CRS', [Validators.required]],
      tokenOutAmount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      tokenOut: [null, [Validators.required]],
      deadline: [''],
      tolerance: ['']
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
    let deadline = 0;

    const payload = {
      tokenOut: this.tokenOut.value,
      tokenInAmount: this.tokenInAmount.value,
      tokenOutAmount: this.tokenOutAmount.value,
      tokenInExactAmount: this.tokenInExact,
      recipient: this.context.wallet,
      tokenInMaximumAmount: this.tokenInMax,
      tokenOutMinimumAmount: this.tokenOutMin,
      deadline: deadline
    }

    this._platformApi
      .swapQuote(this.tokenIn.value, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote));
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
    if (!value || value.replace('0', '') === '.' || !value.includes('.')) {
      return of('0');
    }

    const valueDecimals = this.tokenInExact ? this.tokenInDetails.decimals : this.tokenOutDetails.decimals;
    var fixedDecimalValue = new FixedDecimal(value, valueDecimals);

    const payload = {
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

    if (this.tokenIn.value === 'CRS') {
      return of(null);
    }

    return this._platformApi.getAllowance(this.context.wallet, spender, this.tokenIn.value)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, this.tokenInAmount.value, this.tokenInDetails)),
        tap((rsp: AllowanceValidation) => this.allowance = rsp));
  }

  calcTolerance(tolerance?: number) {
    if (tolerance) this.setTolerance = tolerance;

    if (this.setTolerance > 99.99 || this.setTolerance < .01) return;
    if (!this.tokenInAmount.value || !this.tokenInAmount.value) return;

    this.tokenInMax = this._math.multiply(
      new FixedDecimal(this.tokenInAmount.value, this.tokenInDetails.decimals),
      new FixedDecimal((1 + (this.setTolerance / 100)).toString(), 8));

    let tokenOutValue = new FixedDecimal(this.tokenOutAmount.value, this.tokenOutDetails.decimals);
    let minTolerance = this._math.multiply(tokenOutValue, new FixedDecimal((this.setTolerance / 100).toString(), 8));
    this.tokenOutMin = this._math.subtract(tokenOutValue, new FixedDecimal(minTolerance, this.tokenOutDetails.decimals));

    this.tokenInFiatValue = this._math.multiply(new FixedDecimal(this.tokenInAmount.value, this.tokenInDetails.decimals), new FixedDecimal(this.tokenInDetails.summary.price.close, 8));
    this.tokenOutFiatValue = this._math.multiply(new FixedDecimal(this.tokenOutAmount.value, this.tokenOutDetails.decimals), new FixedDecimal(this.tokenOutDetails.summary.price.close, 8));
    this.tokenInMaxFiatValue = this._math.multiply(new FixedDecimal(this.tokenInMax, this.tokenInDetails.decimals), new FixedDecimal(this.tokenInDetails.summary.price.close, 8));
    this.tokenOutMinFiatValue = this._math.multiply(new FixedDecimal(this.tokenOutMin, this.tokenOutDetails.decimals), new FixedDecimal(this.tokenOutDetails.summary.price.close, 8));
  }

  toggleShowMore(value: boolean) {
    this.showMore = value;
  }

  calcDeadline(minutes: number) {

  }

  ngOnDestroy() {
    if (this.tokenInChanges$) this.tokenInChanges$.unsubscribe();
    if (this.tokenOutChanges$) this.tokenOutChanges$.unsubscribe();
  }
}
