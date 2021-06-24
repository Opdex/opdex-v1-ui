import { environment } from '@environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-tx-provide-remove',
  templateUrl: './tx-provide-remove.component.html',
  styleUrls: ['./tx-provide-remove.component.scss']
})
export class TxProvideRemoveComponent extends TxBase {
  @Input() pool: ILiquidityPoolSummaryResponse;
  txHash: string;
  form: FormGroup;

  get liquidity(): FormControl {
    return this.form.get('liquidity') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService
  ) {
    super(_dialog);

    this.form = this._fb.group({
      liquidity: ['', [Validators.required, Validators.min(.00000001)]]
    });
  }

  async submit(): Promise<void> {
    const payload = {
      liquidity: this.liquidity.value,
      amountCrsMin: "1.00",
      amountSrcMin: "1.00",
      liquidityPool: this.pool.address,
      recipient: environment.walletAddress
    };

    console.log(payload);

    const response = await this._platformApi.removeLiquidity(payload);
    if (response.hasError) {
      // handle
      console.log(response.error);
    }

    this.txHash = response.data.txHash;
  }
}
