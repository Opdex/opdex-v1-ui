import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';

@Component({
  selector: 'opdex-tx-stake-collect',
  templateUrl: './tx-stake-collect.component.html',
  styleUrls: ['./tx-stake-collect.component.scss']
})
export class TxStakeCollectComponent extends TxBase implements OnChanges {
  @Input() data;
  pool: ILiquidityPoolSummaryResponse;
  form: FormGroup;
  txHash;

  get liquidate(): FormControl {
    return this.form.get('liquidate') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService
  ) {
    super(_dialog);

    this.form = this._fb.group({
      liquidate: [false, [Validators.required]]
    });
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  async submit() {
    const payload = {
      liquidityPool: this.pool.address,
      liquidate: this.liquidate.value
    };

    const response = await this._platformApi.collectStakingRewards(payload);
    if (response.hasError) {
      // handle
      console.log(response.error);
    }

    this.txHash = response.data.txHash;
  }
}
