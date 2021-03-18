import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ConnectWalletModalComponent } from 'src/app/components/modals-module/connect-wallet-modal/connect-wallet-modal.component';

@Component({
  selector: 'opdex-tx-box-remove-liquidity',
  templateUrl: './tx-box-remove-liquidity.component.html',
  styleUrls: ['./tx-box-remove-liquidity.component.scss']
})
export class TxBoxRemoveLiquidityComponent implements OnInit {

  constructor(private _dialog: MatDialog) { }

  ngOnInit(): void { }

  connectWallet(): void {
    this._dialog.open(ConnectWalletModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: ''
    });
  }
}
