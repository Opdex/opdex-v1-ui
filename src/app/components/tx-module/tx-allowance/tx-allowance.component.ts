import { take } from 'rxjs/operators';
import { OnChanges } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/user-context.service';
import { TxBase } from '../tx-base.component';

@Component({
  selector: 'opdex-tx-allowance',
  templateUrl: './tx-allowance.component.html',
  styleUrls: ['./tx-allowance.component.scss']
})
export class TxAllowanceComponent extends TxBase implements OnChanges {
  @Input() data: any;
  pool: ILiquidityPoolSummaryResponse;
  txHash: string;

  form: FormGroup;

  get token(): FormControl {
    return this.form.get('token') as FormControl;
  }

  get spender(): FormControl {
    return this.form.get('spender') as FormControl;
  }

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    protected _userContext: UserContextService
  ) {
    super(_userContext, _dialog);

    this.form = this._fb.group({
      token: ['', [Validators.required]],
      spender: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    });
  }

  ngOnChanges() {
    console.log(this.data)
    this.pool = this.data?.pool;

    this.form.patchValue({
      token: this.data?.token,
      spender: this.data?.spender,
      amount: this.data?.amount
    });
  }

  submit() {
    this._platformApi.getToken(this.token.value)
      .pipe(take(1))
      .subscribe(response => {
        const payload = {
          token: this.token.value,
          amount: parseFloat(this.amount.value).toFixed(response.decimals),
          spender: this.spender.value
        }

        this.signTx(payload, 'approve');
      });
  }
}
