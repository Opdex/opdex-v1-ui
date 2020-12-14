import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { ConnectWalletModalComponent } from './connect-wallet-modal/connect-wallet-modal.component';
import { TxBoxSettingsModalComponent } from './tx-box-settings-modal/tx-box-settings-modal.component';

@NgModule({
  declarations: [
    ConnectWalletModalComponent,
    TxBoxSettingsModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [
  ]
})
export class SidebarModule { }
