import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/user-context.service';
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
    private _platformApi: PlatformApiService,
    protected _userContext: UserContextService
  ) {
    super(_userContext, _dialog);

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

    this.signTx(payload, 'collect-mining-rewards');
  }
}
