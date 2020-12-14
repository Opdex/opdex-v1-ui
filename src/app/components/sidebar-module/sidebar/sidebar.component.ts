import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';
import { ConnectWalletModalComponent } from '../../modals-module/connect-wallet-modal/connect-wallet-modal.component';

@Component({
  selector: 'opdex-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  theme$: Observable<string>;

  constructor(
    private _theme: ThemeService,
    private _dialog: MatDialog
  ) {
    this.theme$ = this._theme.getTheme();
  }

  ngOnInit(): void { }

  setTheme(theme: string) {
    this._theme.setTheme(theme);
  }

  openConnectWalletModal(): void {
    this._dialog.open(ConnectWalletModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: ''
    });
  }
}
