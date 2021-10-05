import { DecimalStringRegex } from '@sharedLookups/regex';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Observable, throwError, timer } from 'rxjs';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, catchError, take, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { IToken } from '@sharedModels/responses/platform-api/tokens/token.interface';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Icons } from 'src/app/enums/icons';
import { TransactionTypes } from 'src/app/enums/transaction-types';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';
import { MathService } from '@sharedServices/utility/math.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

@Component({
  selector: 'opdex-tx-provide-add',
  templateUrl: './tx-provide-add.component.html',
  styleUrls: ['./tx-provide-add.component.scss']
})
export class TxProvideAddComponent extends TxBase implements OnInit {
  @Input() pool: ILiquidityPoolSummary;
  icons = Icons;
  txHash: string;
  subscription = new Subscription();
  allowance: AllowanceValidation;
  form: FormGroup;
  transactionTypes = TransactionTypes;
  showMore: boolean = false;
  crsInFiatValue: string;
  crsInMinFiatValue: string;
  srcInFiatValue: string;
  srcInMinFiatValue: string;
  setTolerance = 0.1;
  crsInMin: string;
  srcInMin: string;
  allowanceTransaction$: Subscription;

  get amountCrs(): FormControl {
    return this.form.get('amountCrs') as FormControl;
  }

  get amountSrc(): FormControl {
    return this.form.get('amountSrc') as FormControl;
  }

  get deadline(): FormControl {
    return this.form.get('deadline') as FormControl;
  }

  get tolerance(): FormControl {
    return this.form.get('tolerance') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    protected _userContext: UserContextService,
    protected _bottomSheet: MatBottomSheet,
    private _math: MathService
  ) {
    super(_userContext, _dialog, _bottomSheet);

    this.form = this._fb.group({
      amountCrs: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      amountSrc: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      deadline: [''],
      tolerance: ['']
    });
  }

  // Bug -
  // Set CRS amount in (quotes and sets SRC amount)
  // Change SRC amount (quote and change CRS amount)
  // Change CRS amount (12.24999999 to 12.25) registers no change, no re-quote is given.
  // FINDINGS
  // This is because CRS value is manually typed, auto populates SRC value with quote. Change SRC value, auto re-populates CRS from quote.
  // Then changing CRS does not get triggered by DistinctUntilChanged(), it never knew about the auto populated quote changes so it thinks nothing changed.
  //
  // This isn't reproducible 100% of the time, there must be more to it.
  ngOnInit(): void {
    this.subscription.add(
      this.amountCrs.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(amount => this.quote$(amount, this.pool?.token?.crs)),
          tap(amount => this.amountSrc.setValue(amount, { emitEvent: false })),
          tap(_ => this.calcTolerance()),
          filter(_ => this.context?.wallet),
          switchMap(amount => this.getAllowance$()))
        .subscribe());

    this.subscription.add(
      this.amountSrc.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(amount => this.quote$(amount, this.pool?.token?.src)),
          tap(quoteAmount => this.amountCrs.setValue(quoteAmount, { emitEvent: false })),
          tap(_ => this.calcTolerance()),
          filter(_ => this.context?.wallet),
          switchMap(_ => this.getAllowance$()))
        .subscribe());
  }

  getAllowance$():Observable<AllowanceValidation> {
    const spender = environment.routerAddress;
    const token = this.pool?.token?.src?.address;

    return this._platformApi
      .getAllowance(this.context.wallet, spender, token)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, this.amountSrc.value, this.pool.token.src)),
        tap((rsp: AllowanceValidation) => this.allowance = rsp)
      );
  }

  quote$(value: string, tokenIn: IToken): Observable<string> {
    if (!tokenIn) {
      throwError('Invalid token');
    }

    if (!this.pool.reserves?.crs || this.pool.reserves.crs === '0.00000000') return of('');

    // Technically the input should be made invalid in this case using form validations, cannot end with decimal point
    if (value.endsWith('.')) value = `${value}00`;

    const payload = {
      amountIn: value,
      tokenIn: tokenIn.address,
      pool: this.pool.address
    };

    return this._platformApi.quoteAddLiquidity(payload).pipe(catchError(() => of('')));
  }

  submit(): void {
    let crsValue = this.amountCrs.value.toString().replace(/,/g, '');
    if (!crsValue.includes('.')) crsValue = `${crsValue}.00`;

    let srcValue = this.amountSrc.value.toString().replace(/,/g, '');
    if (!srcValue.includes('.')) srcValue = `${srcValue}.00`;

    const payload = {
      amountCrs: crsValue,
      amountSrc: srcValue,
      recipient: this.context.wallet,
      amountCrsMin: this.crsInMin,
      amountSrcMin: this.srcInMin,
      deadline: 0
    }

    this._platformApi
      .addLiquidityQuote(this.pool.address, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this.quote(quote);
        });
  }

  calcTolerance(tolerance?: number) {
    if (tolerance) this.setTolerance = tolerance;

    if (this.setTolerance > 99.99 || this.setTolerance < .01) return;
    if (!this.amountCrs.value || !this.amountSrc.value) return;

    let crsInValue = new FixedDecimal(this.amountCrs.value, this.pool.token.crs.decimals);
    let crsMinTolerance = this._math.multiply(crsInValue, new FixedDecimal((this.setTolerance / 100).toString(), 8));
    this.crsInMin = this._math.subtract(crsInValue, new FixedDecimal(crsMinTolerance, this.pool.token.crs.decimals));

    let srcInValue = new FixedDecimal(this.amountSrc.value, this.pool.token.src.decimals);
    let srcMinTolerance = this._math.multiply(srcInValue, new FixedDecimal((this.setTolerance / 100).toString(), 8));
    this.srcInMin = this._math.subtract(srcInValue, new FixedDecimal(srcMinTolerance, this.pool.token.src.decimals));

    this.crsInFiatValue = this._math.multiply(new FixedDecimal(this.amountCrs.value, this.pool.token.crs.decimals), new FixedDecimal(this.pool.token.crs.summary.price.close.toString(), 8));
    this.crsInMinFiatValue = this._math.multiply(new FixedDecimal(this.crsInMin, this.pool.token.crs.decimals), new FixedDecimal(this.pool.token.crs.summary.price.close.toString(), 8));
    this.srcInFiatValue = this._math.multiply(new FixedDecimal(this.amountSrc.value, this.pool.token.src.decimals), new FixedDecimal(this.pool.token.src.summary.price.close.toString(), 8));
    this.srcInMinFiatValue = this._math.multiply(new FixedDecimal(this.srcInMin, this.pool.token.src.decimals), new FixedDecimal(this.pool.token.src.summary.price.close.toString(), 8));
  }

  toggleShowMore(value: boolean) {
    this.showMore = value;
  }

  calcDeadline(minutes: number) {

  }

  allowanceApproval(txHash: string) {
    if (txHash || this.allowance.isApproved || this.allowanceTransaction$) {
      if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
    }

    this.allowanceTransaction$ = timer(8000, 8000)
      .pipe(switchMap(_ => this.getAllowance$()))
      .subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
