import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { take } from 'rxjs/operators';
import { OnChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';

@Component({
  selector: 'opdex-tx-mine-stop',
  templateUrl: './tx-mine-stop.component.html',
  styleUrls: ['./tx-mine-stop.component.scss']
})
export class TxMineStopComponent extends TxBase implements OnChanges {
  @Input() data;
  form: FormGroup;
  pool: ILiquidityPoolSummary;
  txHash: string;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
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
      amount: ['', [Validators.required, Validators.min(.00000001)]]
    });
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  submit(): void {
    let amount = this.amount.value.toString().replace(/,/g, '');
    if (!amount.includes('.')) amount = `${amount}.00`;

    const payload = {
      miningPool: this.pool.mining?.address,
      amount: amount
    }

    this.quoteTransaction(payload, 'stop-mining');
  }
}
