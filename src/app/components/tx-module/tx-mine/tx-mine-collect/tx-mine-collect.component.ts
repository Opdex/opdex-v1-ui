import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-swap/tx-base.component';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-mine-collect',
  templateUrl: './tx-mine-collect.component.html',
  styleUrls: ['./tx-mine-collect.component.scss']
})
export class TxMineCollectComponent extends TxBase implements OnChanges {
  @Input() data: any;
  pool: ILiquidityPoolSummaryResponse;
  form: FormGroup;
  txHash: string;

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

  ngOnChanges() {
    this.pool = this.data?.pool;
  }

  submit(): void {
    const payload = {
      liquidityPool: this.pool.address
    }

    this._platformApi.collectMiningRewards(payload)
      .pipe(take(1))
      .subscribe(response => this.txHash = response.txHash);
  }
}
