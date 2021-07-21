import { UserContextService } from './../../../../services/user-context.service';
import { environment } from '@environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-tx-provide-remove',
  templateUrl: './tx-provide-remove.component.html',
  styleUrls: ['./tx-provide-remove.component.scss']
})
export class TxProvideRemoveComponent extends TxBase {
  @Input() pool: ILiquidityPoolSummaryResponse;
  txHash: string;
  form: FormGroup;
  context: any;
  allowance$: Observable<any>;

  get liquidity(): FormControl {
    return this.form.get('liquidity') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    protected _userContext: UserContextService
  ) {
    super(_userContext, _dialog);

    this.form = this._fb.group({
      liquidity: ['', [Validators.required, Validators.min(.00000001)]]
    });

    this.allowance$ = this.liquidity.valueChanges
      .pipe(switchMap(amount => this.getAllowance$(amount)));
  }

  getAllowance$(amount: string):Observable<any> {
    // Todo: shouldn't be hard coded
    const router = environment.routerAddress;
    const token = this.pool?.token?.lp?.address;

    return this._platformApi.getApprovedAllowance(this.context.wallet, router, token)
      .pipe(
        map(allowances => {
          let valueApproved = false;

          if (allowances.length) valueApproved = BigInt(amount.replace('.', '')) <= BigInt(allowances[0]?.allowance.replace('.', ''));

          return { spender: router, token, amount, allowances, valueApproved }
        })
      );
  }

  submit(): void {
    const payload = {
      liquidity: this.liquidity.value,
      amountCrsMin: "1.00",
      amountSrcMin: "1.00",
      liquidityPool: this.pool.address,
      recipient: this.context.wallet
    };

    this.signTx(payload, 'remove-liquidity');
  }
}
