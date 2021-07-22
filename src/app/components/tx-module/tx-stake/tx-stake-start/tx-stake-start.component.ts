import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/user-context.service';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap, map } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-stake-start',
  templateUrl: './tx-stake-start.component.html',
  styleUrls: ['./tx-stake-start.component.scss']
})
export class TxStakeStartComponent extends TxBase implements OnChanges {
  @Input() data;
  form: FormGroup;
  pool: ILiquidityPoolSummaryResponse;
  txHash: string;
  allowance$: Observable<any>;
  valueApproved: boolean;

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
      amount: ['', [Validators.required, Validators.min(.00000001)]]
    });

    this.allowance$ = this.amount.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((amount: string) => {
          const spender = this.data?.pool?.address;
          const token = this.data?.pool?.token?.staking?.address;

          return this._platformApi.getApprovedAllowance(this.context.wallet, spender, token).pipe(map(allowances => {
            const amountBigInt = BigInt(amount.toString().replace('.', ''));
            const allowanceBigInt = BigInt(allowances[0]?.allowance?.replace('.', '') || "0");

            return { spender, token, amount, allowances, valueApproved: amountBigInt <= allowanceBigInt }
          }));
        }),
        tap(rsp => {
          this.valueApproved = rsp.valueApproved;
          console.log(rsp);
        })
      );
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  submit(): void {
    const payload = {
      liquidityPool: this.pool.address,
      amount: this.amount.value
    }

    this.signTx(payload, 'start-staking');
  }
}
