import { DecimalStringRegex, sanitize } from '@sharedLookups/regex';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Observable, throwError } from 'rxjs';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, catchError, take, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { IToken } from '@sharedModels/responses/platform-api/tokens/token.interface';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Icons } from 'src/app/enums/icons';
import { TransactionTypes } from 'src/app/enums/transaction-types';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';

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

  get amountCrs(): FormControl {
    return this.form.get('amountCrs') as FormControl;
  }

  get amountSrc(): FormControl {
    return this.form.get('amountSrc') as FormControl;
  }

  get deadline(): FormControl {
    return this.form.get('deadline') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    protected _userContext: UserContextService,
    protected _bottomSheet: MatBottomSheet
  ) {
    super(_userContext, _dialog, _bottomSheet);

    this.form = this._fb.group({
      amountCrs: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      amountSrc: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      deadline: [new Date(), [Validators.required]]
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
          switchMap(amount => this.getAllowance$(amount)))
        .subscribe(allowance => this.amountSrc.setValue(allowance.requestToSpend, { emitEvent: false })));

    this.subscription.add(
      this.amountSrc.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap((requestAmount: string) => this.getAllowance$(requestAmount)),
          switchMap((allowance: AllowanceValidation) => this.quote$(allowance.requestToSpend, this.pool?.token?.src)),
          tap((quoteAmount: string) => {
            // The "if" _was_ protecting against new liquidity pools calculating quotes however this check is not on amountCrs valueChanges - re-evaluate
            if (quoteAmount != '') this.amountCrs.setValue(quoteAmount, { emitEvent: false })
          }),
        )
        .subscribe());
  }

  getAllowance$(amount: string):Observable<AllowanceValidation> {
    const spender = environment.routerAddress;
    const token = this.pool?.token?.src?.address;

    console.log(amount);

    return this._platformApi
      .getAllowance(this.context.wallet, spender, token)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, amount, this.pool.token.src)),
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

    console.log(payload)

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
      // todo: Rework to send the actual block number
      // deadline: this.deadline.value.toISOString(),
      // tolerance: .01,
      amountCrsMin: '0.00000001',
      amountSrcMin: '0.00000001',
      recipient: this.context.wallet,
      // liquidityPool: this.pool.address
    }

    this._platformApi
      .addLiquidityQuote(this.pool.address, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this.quote(quote);
        });

    // this.signTx(payload, 'add-liquidity');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
