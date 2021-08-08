import { UserContextService } from '@sharedServices/utility/user-context.service';
import { environment } from '@environments/environment';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AllowanceValidation } from '@sharedModels/allowance-validation';

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
  allowance$: Observable<AllowanceValidation>;

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
    const spender = environment.routerAddress;
    const token = this.pool?.token?.lp?.address;

    return this._platformApi
      .getAllowance(this.context.wallet, spender, token)
      .pipe(map(allowanceResponse => new AllowanceValidation(allowanceResponse, amount, 8)));
  }

  submit(): void {
    let liquidity = this.liquidity.value.toString().replace(/,/g, '');
    if (!liquidity.includes('.')) liquidity = `${liquidity}.00`;

    const payload = {
      liquidity: liquidity,
      amountCrsMin: '0.00000001',
      amountSrcMin: '0.00000001',
      liquidityPool: this.pool.address,
      recipient: this.context.wallet
    };

    this.signTx(payload, 'remove-liquidity');
  }
}
