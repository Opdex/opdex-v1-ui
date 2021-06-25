import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnChanges } from '@angular/core';
import { ConnectWalletModalComponent } from 'src/app/components/modals-module/connect-wallet-modal/connect-wallet-modal.component';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-tx-mine',
  templateUrl: './tx-mine.component.html',
  styleUrls: ['./tx-mine.component.scss']
})
export class TxMineComponent implements OnChanges {
  @Input() data: any;
  pool: ILiquidityPoolSummaryResponse;
  child: number = 1;
  txOptions = [
    { action: 'Start', value: 1 },
    { action: 'Stop', value: 2 },
    { action: 'Collect', value: 3 }
  ];

  constructor(private _dialog: MatDialog) { }

  ngOnChanges(): void {
    this.child = this.txOptions.find(o => o.action.toLowerCase() == this.data?.child)?.value || 1;
    this.pool = this.data?.pool;
  }

  connectWallet(): void {
    this._dialog.open(ConnectWalletModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: ''
    });
  }
}
