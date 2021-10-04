import { SharedModule } from '@sharedComponents/shared-module/shared.module';
import { SharedPipesModule } from './../../pipes/shared-pipes.module';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { QRCodeModule } from 'angularx-qrcode';

import { ConnectWalletModalComponent } from './connect-wallet-modal/connect-wallet-modal.component';
import { TxBoxSettingsModalComponent } from './tx-box-settings-modal/tx-box-settings-modal.component';
import { TokensModalComponent } from './tokens-modal/tokens-modal.component';
import { SignTxModalComponent } from './sign-tx-modal/sign-tx-modal.component';
import { HelpModalComponent } from './help-modal/help-modal.component';
import { BugReportModalComponent } from './bug-report-modal/bug-report-modal.component';

@NgModule({
  declarations: [
    ConnectWalletModalComponent,
    TxBoxSettingsModalComponent,
    SignTxModalComponent,
    TokensModalComponent,
    HelpModalComponent,
    BugReportModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedPipesModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    QRCodeModule,
    SharedModule
  ],
  exports: [
    HelpModalComponent,
    BugReportModalComponent
  ]
})
export class ModalsModule { }
