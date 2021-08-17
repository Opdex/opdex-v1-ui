import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Observable, throwError } from 'rxjs';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'opdex-tx-provide-add',
  templateUrl: './tx-provide-add.component.html',
  styleUrls: ['./tx-provide-add.component.scss']
})
export class TxProvideAddComponent extends TxBase implements OnInit {
  @Input() pool: ILiquidityPoolSummaryResponse;
  txHash: string;
  subscription = new Subscription();
  allowance: AllowanceValidation;

  form: FormGroup;

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
      amountCrs: ['', [Validators.required]],
      amountSrc: ['', [Validators.required]],
      deadline: [new Date(), [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.amountCrs.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(amount => this.quote$(amount, this.pool?.token?.crs)),
          switchMap(amount => this.getAllowance$(amount))
        )
        .subscribe(allowance => {
          this.amountSrc.setValue(allowance.requestToSpend, { emitEvent: false })
        }));

    this.subscription.add(
      this.amountSrc.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap((requestAmount: string) => this.getAllowance$(requestAmount)),
          switchMap((allowance: AllowanceValidation) => this.quote$(allowance.requestToSpend, this.pool?.token?.src)),
          tap((quoteAmount: string) => {
            if (quoteAmount != '') this.amountCrs.setValue(quoteAmount, { emitEvent: false })
          }),
        )
        .subscribe());
  }

  getAllowance$(amount: string):Observable<AllowanceValidation> {
    const spender = environment.routerAddress;
    const token = this.pool?.token?.src?.address;

    return this._platformApi
      .getAllowance(this.context.wallet, spender, token)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, amount, this.pool.token.src.decimals)),
        tap((rsp: AllowanceValidation) => this.allowance = rsp)
      );
  }

  quote$(value: string, tokenIn: IToken): Observable<string> {
    if (!tokenIn) {
      throwError('Invalid token');
    }

    if (!this.pool.reserves?.crs || this.pool.reserves.crs === '0.00000000') return of('');

    value = value.replace(/,/g, '');
    if (!value.includes('.')) value = `${value}.00`;

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
      deadline: this.deadline.value.toISOString(),
      tolerance: .01,
      recipient: this.context.wallet,
      liquidityPool: this.pool.address
    }

    this.signTx(payload, 'add-liquidity');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
