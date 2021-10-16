import { BlocksService } from '@sharedServices/platform/blocks.service';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { Component, Input, OnInit, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, throwError, timer } from 'rxjs';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, catchError, take, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { Icons } from 'src/app/enums/icons';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { MathService } from '@sharedServices/utility/math.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IAddLiquidityRequest, AddLiquidityRequest } from '@sharedModels/platform-api/requests/liquidity-pools/add-liquidity-request';
import { IAddLiquidityQuoteRequest } from '@sharedModels/platform-api/requests/quotes/add-liquidity-quote-request';
import { IProvideAmountIn } from '@sharedModels/platform-api/responses/liquidity-pools/provide-amount-in.interface';

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
  transactionTypes = AllowanceRequiredTransactionTypes;
  showMore: boolean = false;
  crsInFiatValue: string;
  crsInMinFiatValue: string;
  srcInFiatValue: string;
  srcInMinFiatValue: string;
  toleranceThreshold = 0.1;
  deadlineThreshold = 10;
  crsInMin: string;
  srcInMin: string;
  allowanceTransaction$: Subscription;
  latestSyncedBlock$: Subscription;
  latestBlock: number;

  get amountCrs(): FormControl {
    return this.form.get('amountCrs') as FormControl;
  }

  get amountSrc(): FormControl {
    return this.form.get('amountSrc') as FormControl;
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
      amountCrs: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      amountSrc: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
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
          tap(amount => {
            if (amount !== '') this.amountSrc.setValue(amount, { emitEvent: false })
          }),
          tap(_ => this.calcTolerance()),
          filter(_ => this.context?.wallet),
          switchMap(_ => this.getAllowance$()))
        .subscribe());

    this.subscription.add(
      this.amountSrc.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(amount => this.quote$(amount, this.pool?.token?.src)),
          tap(quoteAmount => {
            if (quoteAmount !== '') this.amountCrs.setValue(quoteAmount, { emitEvent: false })
          }),
          tap(_ => this.calcTolerance()),
          filter(_ => this.context?.wallet),
          switchMap(_ => this.getAllowance$()))
        .subscribe());

      this.latestSyncedBlock$ = this._blocksService.getLatestBlock$().subscribe(block => this.latestBlock = block?.height);
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

    const payload: IAddLiquidityQuoteRequest = {
      amountIn: value,
      tokenIn: tokenIn.address
    };

    return this._platformApi.quoteAddLiquidity(this.pool.address, payload)
      .pipe(
        map((response: IProvideAmountIn) => response?.amountIn || ''),
        catchError(() => of('')));
  }

  submit(): void {
    let crsValue = this.amountCrs.value.toString().replace(/,/g, '');
    if (!crsValue.includes('.')) crsValue = `${crsValue}.00`;

    let srcValue = this.amountSrc.value.toString().replace(/,/g, '');
    if (!srcValue.includes('.')) srcValue = `${srcValue}.00`;

    const payload: IAddLiquidityRequest = new AddLiquidityRequest({
      amountCrs: crsValue,
      amountSrc: srcValue,
      recipient: this.context.wallet,
      amountCrsMin: this.crsInMin,
      amountSrcMin: this.srcInMin,
      deadline: this.calcDeadline(this.deadlineThreshold)
    });

    if(payload.isValid){
      this._platformApi
        .addLiquidityQuote(this.pool.address, payload)
          .pipe(take(1))
          .subscribe((quote: ITransactionQuote) => {
            this.quote(quote);
          });
    }
  }

  calcTolerance(tolerance?: number) {
    if (tolerance) this.toleranceThreshold = tolerance;

    if (this.toleranceThreshold > 99.99 || this.toleranceThreshold < .01) return;
    if (!this.amountCrs.value || !this.amountSrc.value) return;

    let crsInValue = new FixedDecimal(this.amountCrs.value, this.pool.token.crs.decimals);
    let crsMinTolerance = MathService.multiply(crsInValue, new FixedDecimal((this.toleranceThreshold / 100).toFixed(8), 8));
    this.crsInMin = MathService.subtract(crsInValue, new FixedDecimal(crsMinTolerance, this.pool.token.crs.decimals));

    let srcInValue = new FixedDecimal(this.amountSrc.value, this.pool.token.src.decimals);
    let srcMinTolerance = MathService.multiply(srcInValue, new FixedDecimal((this.toleranceThreshold / 100).toFixed(8), 8));
    this.srcInMin = MathService.subtract(srcInValue, new FixedDecimal(srcMinTolerance, this.pool.token.src.decimals));

    this.crsInFiatValue = MathService.multiply(new FixedDecimal(this.amountCrs.value, this.pool.token.crs.decimals), new FixedDecimal(this.pool.token.crs.summary.price.close.toString(), 8));
    this.crsInMinFiatValue = MathService.multiply(new FixedDecimal(this.crsInMin, this.pool.token.crs.decimals), new FixedDecimal(this.pool.token.crs.summary.price.close.toString(), 8));
    this.srcInFiatValue = MathService.multiply(new FixedDecimal(this.amountSrc.value, this.pool.token.src.decimals), new FixedDecimal(this.pool.token.src.summary.price.close.toString(), 8));
    this.srcInMinFiatValue = MathService.multiply(new FixedDecimal(this.srcInMin, this.pool.token.src.decimals), new FixedDecimal(this.pool.token.src.summary.price.close.toString(), 8));
  }

  toggleShowMore(value: boolean) {
    this.showMore = value;
  }

  calcDeadline(minutes: number): number {
    this.deadlineThreshold = minutes;
    const blocks = Math.ceil(60 * minutes / 16);

    return blocks + this.latestBlock;
  }

  handleAllowanceApproval(txHash: string) {
    if (txHash || this.allowance.isApproved || this.allowanceTransaction$) {
      if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
    }

    this.allowanceTransaction$ = timer(8000, 8000)
      .pipe(switchMap(_ => this.getAllowance$()))
      .subscribe();
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
    this.subscription.unsubscribe();
    if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
    if (this.latestSyncedBlock$) this.latestSyncedBlock$.unsubscribe();
  }
}
