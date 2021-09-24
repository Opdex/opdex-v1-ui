import { UserContextService } from '@sharedServices/utility/user-context.service';
import { environment } from '@environments/environment';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Icons } from 'src/app/enums/icons';
import { TransactionTypes } from 'src/app/enums/transaction-types';

@Component({
  selector: 'opdex-tx-provide-remove',
  templateUrl: './tx-provide-remove.component.html',
  styleUrls: ['./tx-provide-remove.component.scss']
})
export class TxProvideRemoveComponent extends TxBase {
  @Input() pool: ILiquidityPoolSummary;
  icons = Icons;
  txHash: string;
  form: FormGroup;
  context: any;
  allowance$: Observable<AllowanceValidation>;
  transactionTypes = TransactionTypes;

  get liquidity(): FormControl {
    return this.form.get('liquidity') as FormControl;
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
      .pipe(map(allowanceResponse => new AllowanceValidation(allowanceResponse, amount, this.pool.token.lp)));
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

    this.quoteTransaction(payload, 'remove-liquidity');
  }
}
