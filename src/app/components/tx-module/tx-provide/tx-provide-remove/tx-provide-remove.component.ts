import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { environment } from '@environments/environment';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { switchMap, map, take, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Observable, Subscription, timer } from 'rxjs';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Icons } from 'src/app/enums/icons';
import { TransactionTypes } from 'src/app/enums/transaction-types';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';
import { DecimalStringRegex } from '@sharedLookups/regex';

@Component({
  selector: 'opdex-tx-provide-remove',
  templateUrl: './tx-provide-remove.component.html',
  styleUrls: ['./tx-provide-remove.component.scss']
})
export class TxProvideRemoveComponent extends TxBase {
  @Input() pool: ILiquidityPoolSummary;
  icons = Icons;
  form: FormGroup;
  context: any;
  allowance$: Subscription;
  transactionTypes = TransactionTypes;
  showMore: boolean = false;
  lptInFiatValue: string;
  lptInMinFiatValue: string;
  usdOut: string;
  crsOut: string;
  crsOutMin: string;
  srcOut: string;
  srcOutMin: string;
  setTolerance = 0.1;
  allowanceTransaction$: Subscription;
  allowance: AllowanceValidation;

  get liquidity(): FormControl {
    return this.form.get('liquidity') as FormControl;
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
      liquidity: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      deadline: [''],
      tolerance: ['']
    });

    this.allowance$ = this.liquidity.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.calcTolerance()),
        filter(_ => this.context.wallet !== undefined),
        switchMap(amount => this.getAllowance$(amount)))
        .subscribe();
  }

  getAllowance$(amount?: string):Observable<any> {
    amount = amount || this.liquidity.value;
    const spender = environment.routerAddress;
    const token = this.pool?.token?.lp?.address;

    return this._platformApi
      .getAllowance(this.context.wallet, spender, token)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, amount, this.pool.token.lp)),
        tap((rsp: AllowanceValidation) => this.allowance = rsp));
  }

  submit(): void {
    let liquidity = this.liquidity.value.toString().replace(/,/g, '');
    if (!liquidity.includes('.')) liquidity = `${liquidity}.00`;

    const payload = {
      liquidity: liquidity,
      amountCrsMin: this.crsOutMin,
      amountSrcMin: this.srcOutMin,
      liquidityPool: this.pool.address,
      recipient: this.context.wallet,
      deadline: 0
    };

    this._platformApi
      .removeLiquidityQuote(payload.liquidityPool, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this.quote(quote);
        });
  }

  calcTolerance(tolerance?: number) {
    if (tolerance) this.setTolerance = tolerance;

    if (this.setTolerance > 99.99 || this.setTolerance < .01) return;
    if (!this.liquidity.value) return;

    const lptDecimals = this.pool.token.lp.decimals;
    const liquidityValue = new FixedDecimal(this.liquidity.value, lptDecimals);
    const totalSupply = new FixedDecimal(this.pool.token.lp.totalSupply.toString(), lptDecimals);

    const crsDecimals = this.pool.token.crs.decimals;
    const srcDecimals = this.pool.token.src.decimals;
    const reservesUsd = new FixedDecimal(this.pool.reserves.usd.toString(), 8);
    const reserveCrs = new FixedDecimal(this.pool.reserves.crs, crsDecimals);
    const reserveSrc = new FixedDecimal(this.pool.reserves.src, srcDecimals);

    const percentageLiquidity = new FixedDecimal(this._math.divide(liquidityValue, totalSupply), 8);

    this.crsOut = this._math.multiply(reserveCrs, percentageLiquidity);
    this.srcOut = this._math.multiply(reserveSrc, percentageLiquidity);
    this.usdOut = this._math.multiply(reservesUsd, percentageLiquidity);

    const crsOut = new FixedDecimal(this.crsOut, crsDecimals);
    const srcOut = new FixedDecimal(this.srcOut, srcDecimals);
    const usdOut = new FixedDecimal(this.usdOut, 8);

    const tolerancePercentage = new FixedDecimal((this.setTolerance / 100).toString(), 8);

    const crsTolerance = new FixedDecimal(this._math.multiply(crsOut, tolerancePercentage), crsDecimals);
    const srcTolerance = new FixedDecimal(this._math.multiply(srcOut, tolerancePercentage), srcDecimals);
    const usdTolerance = new FixedDecimal(this._math.multiply(usdOut, tolerancePercentage), 8);

    this.crsOutMin = this._math.subtract(crsOut, crsTolerance);
    this.srcOutMin = this._math.subtract(srcOut, srcTolerance);
    this.lptInFiatValue = this._math.subtract(usdOut, usdTolerance);
  }

  handleAllowanceApproval(txHash: string) {
    if (txHash || this.allowance.isApproved || this.allowanceTransaction$) {
      if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
    }

    this.allowanceTransaction$ = timer(8000, 8000)
      .pipe(switchMap(_ => this.getAllowance$()))
      .subscribe();
  }


  toggleShowMore(value: boolean) {
    this.showMore = value;
  }

  calcDeadline(minutes: number) {

  }

  ngOnDestroy() {
    if (this.allowance$) this.allowance$.unsubscribe();
    if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
  }
}
