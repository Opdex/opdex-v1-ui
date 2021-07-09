import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { TxBase } from '@sharedComponents/tx-module/tx-swap/tx-base.component';
import { ILiquidityPoolSummaryResponse, IToken } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/user-context.service';
import { Observable, throwError } from 'rxjs';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-provide-add',
  templateUrl: './tx-provide-add.component.html',
  styleUrls: ['./tx-provide-add.component.scss']
})
export class TxProvideAddComponent extends TxBase implements OnInit {
  @Input() pool: ILiquidityPoolSummaryResponse;
  txHash: string;
  subscription = new Subscription();

  form: FormGroup;

  get amountCrs(): FormControl {
    return this.form.get('amountCrs') as FormControl;
  }

  get amountSrc(): FormControl {
    return this.form.get('amountSrc') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    protected _userContext: UserContextService
  ) {
    super(_userContext, _dialog);

    this.form = this._fb.group({
      amountCrs: ['', [Validators.required]],
      amountSrc: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.amountCrs.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(value => this.quote$(value, this.pool?.token?.crs))
        )
        .subscribe(value => this.amountSrc.setValue(value, { emitEvent: false })));

    this.subscription.add(
      this.amountSrc.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(value => this.quote$(value, this.pool?.token?.src))
        )
        .subscribe(value => this.amountCrs.setValue(value, { emitEvent: false })));
  }

  quote$(value: string, tokenIn: IToken): Observable<string> {
    if (!tokenIn) {
      throwError('Invalid token');
    }

    const payload = {
      amountIn: parseFloat(value).toFixed(tokenIn.decimals),
      tokenIn: tokenIn.address,
      pool: this.pool.address
    };

    return this._platformApi.quoteAddLiquidity(payload);
  }

  submit(): void {
    const payload = {
      amountCrs: parseFloat(this.amountCrs.value).toFixed(8),
      amountSrc: parseFloat(this.amountSrc.value).toFixed(this.pool.token.src.decimals),
      tolerance: .001,
      recipient: this.context.walletAddress,
      liquidityPool: this.pool.address
    }

    this.signTx(payload, 'add-liquidity');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
