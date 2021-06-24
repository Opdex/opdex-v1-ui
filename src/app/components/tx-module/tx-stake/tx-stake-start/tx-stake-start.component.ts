import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';

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

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService
  ) {
    super(_dialog);

    this.form = this._fb.group({
      amount: ['0', [Validators.required, Validators.min(.00000001)]]
    });
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  async submit() {
    const payload = {
      liquidityPool: this.pool.address,
      amount: this.amount.value
    }

    const response = await this._platformApi.startStaking(payload);
    if (response.hasError) {
      // handle
    }

    this.txHash = response.data.txHash;
  }
}
