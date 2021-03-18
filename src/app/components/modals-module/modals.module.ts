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
import { MatDividerModule } from '@angular/material/divider';

import { ConnectWalletModalComponent } from './connect-wallet-modal/connect-wallet-modal.component';
import { TxBoxSettingsModalComponent } from './tx-box-settings-modal/tx-box-settings-modal.component';
import { SignTxModalComponent } from './sign-tx-modal/sign-tx-modal.component';

@NgModule({
  declarations: [
    ConnectWalletModalComponent,
    TxBoxSettingsModalComponent,
    SignTxModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule
  ],
  exports: [
  ]
})
export class ModalsModule { }
