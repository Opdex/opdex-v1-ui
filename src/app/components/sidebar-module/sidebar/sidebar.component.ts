import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConnectWalletModalComponent } from '../../modals-module/connect-wallet-modal/connect-wallet-modal.component';

@Component({
  selector: 'opdex-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  theme$: Observable<string>;

  constructor(private _dialog: MatDialog) { }

  openConnectWalletModal(): void {
    this._dialog.open(ConnectWalletModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: ''
    });
  }
}
