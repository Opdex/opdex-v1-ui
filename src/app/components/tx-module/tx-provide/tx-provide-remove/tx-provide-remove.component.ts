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
  toleranceThreshold = 0.1;
  deadlineThreshold = 10;
  allowanceTransaction$: Subscription;
  allowance: AllowanceValidation;
  latestSyncedBlock$: Subscription;
  latestBlock: number;

  get liquidity(): FormControl {
    return this.form.get('liquidity') as FormControl;
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

    if (this.context?.preferences?.deadlineThreshold) {
      this.deadlineThreshold = this.context.preferences.deadlineThreshold;
    }

    if (this.context?.preferences?.toleranceThreshold) {
      this.toleranceThreshold = this.context.preferences.toleranceThreshold;
    }

    this.form = this._fb.group({
      liquidity: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
    });

    this.allowance$ = this.liquidity.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.calcTolerance()),
        filter(_ => this.context.wallet !== undefined),
        switchMap(amount => this.getAllowance$(amount)))
        .subscribe();

      this.latestSyncedBlock$ = timer(0,8000)
        .pipe(
          switchMap(_ => this._platformApi.getLatestSyncedBlock()),
          tap(block => this.latestBlock = block.height)).subscribe();
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
      deadline: this.calcDeadline(this.deadlineThreshold)
    };

    this._platformApi
      .removeLiquidityQuote(payload.liquidityPool, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this.quote(quote);
        });
  }

  calcTolerance(tolerance?: number) {
    if (tolerance) this.toleranceThreshold = tolerance;

    if (this.toleranceThreshold > 99.99 || this.toleranceThreshold < .01) return;
    if (!this.liquidity.value) return;

    const lptDecimals = this.pool.token.lp.decimals;
    const liquidityValue = new FixedDecimal(this.liquidity.value, lptDecimals);
    const totalSupply = new FixedDecimal(this.pool.token.lp.totalSupply.toString(), lptDecimals);

    const crsDecimals = this.pool.token.crs.decimals;
    const srcDecimals = this.pool.token.src.decimals;
    const reservesUsd = new FixedDecimal(this.pool.reserves.usd.toFixed(8), 8);
    const reserveCrs = new FixedDecimal(this.pool.reserves.crs, crsDecimals);
    const reserveSrc = new FixedDecimal(this.pool.reserves.src, srcDecimals);

    const percentageLiquidity = new FixedDecimal(this._math.divide(liquidityValue, totalSupply), 8);

    this.crsOut = this._math.multiply(reserveCrs, percentageLiquidity);
    this.srcOut = this._math.multiply(reserveSrc, percentageLiquidity);
    this.usdOut = this._math.multiply(reservesUsd, percentageLiquidity);

    const crsOut = new FixedDecimal(this.crsOut, crsDecimals);
    const srcOut = new FixedDecimal(this.srcOut, srcDecimals);
    const usdOut = new FixedDecimal(this.usdOut, 8);

    const tolerancePercentage = new FixedDecimal((this.toleranceThreshold / 100).toFixed(8), 8);

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

  calcDeadline(minutes: number): number {
    this.deadlineThreshold = minutes;
    const blocks = Math.ceil(60 * minutes / 16);

    return blocks + this.latestBlock;
  }

  ngOnDestroy() {
    if (this.allowance$) this.allowance$.unsubscribe();
    if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
    if (this.latestSyncedBlock$) this.latestSyncedBlock$.unsubscribe();
  }
}
