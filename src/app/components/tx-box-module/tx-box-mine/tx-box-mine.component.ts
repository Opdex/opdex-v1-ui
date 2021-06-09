import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ConnectWalletModalComponent } from 'src/app/components/modals-module/connect-wallet-modal/connect-wallet-modal.component';

@Component({
  selector: 'opdex-tx-box-mine',
  templateUrl: './tx-box-mine.component.html',
  styleUrls: ['./tx-box-mine.component.scss']
})
export class TxBoxMineComponent implements OnInit {

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
