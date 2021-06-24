import { MatDialog } from '@angular/material/dialog';
import { Component, Input } from '@angular/core';
import { ConnectWalletModalComponent } from 'src/app/components/modals-module/connect-wallet-modal/connect-wallet-modal.component';
import { OnChanges } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-tx-mine',
  templateUrl: './tx-mine.component.html',
  styleUrls: ['./tx-mine.component.scss']
})
export class TxMineComponent implements OnChanges {
  @Input() data: any;
  pool: ILiquidityPoolSummaryResponse;

  constructor(private _dialog: MatDialog) { }

  ngOnChanges(): void {
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
