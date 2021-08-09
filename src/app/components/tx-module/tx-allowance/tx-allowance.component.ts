import { TokensService } from '@sharedServices/platform/tokens.service';
import { take } from 'rxjs/operators';
import { OnChanges } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { TxBase } from '../tx-base.component';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';

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
    private _tokensService: TokensService,
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
    this.pool = this.data?.pool;

    this.form.patchValue({
      token: this.data?.token,
      spender: this.data?.spender,
      amount: this.data?.amount
    });
  }

  submit() {
    this._tokensService.getToken(this.token.value)
      .pipe(take(1))
      .subscribe((token: IToken) => {
        // was using token above to get decimals and use .toFixed, Todo: Implement padEnd instead.
        let amount = this.amount.value.toString().replace(/,/g, '');
        if (!amount.includes('.')) amount = `${amount}.00`;

        const payload = {
          token: this.token.value,
          amount: amount,
          spender: this.spender.value
        }

        this.signTx(payload, 'approve');
      });
  }
}
