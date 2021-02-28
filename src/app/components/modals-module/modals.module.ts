import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule
  ],
  exports: [
  ]
})
export class ModalsModule { }
