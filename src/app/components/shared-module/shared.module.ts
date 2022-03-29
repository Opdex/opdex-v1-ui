import { SharedPipesModule } from '@sharedPipes/shared-pipes.module';
// Angular Core Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// CDK Imports
import { ClipboardModule } from '@angular/cdk/clipboard';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

// Opdex Component Imports
import { ChangeIndicatorComponent } from './change-indicator/change-indicator.component';
import { CopyButtonComponent } from './copy-button/copy-button.component';
import { CopyAddressComponent } from './copy-address/copy-address.component';
import { HelpButtonComponent } from './help-button/help-button.component';
import { QrCodeComponent } from './qr-code/qr-code.component';

// Other Imports
import { QrCodeModule } from 'ng-qrcode';
import { TokenIconComponent } from './token-icon/token-icon.component';
import { TokenIconsComponent } from './token-icons/token-icons.component';
import { NumberComponent } from './number/number.component';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { TokenNativeChainBadgeComponent } from './token-native-chain-badge/token-native-chain-badge.component';
import { TxQuoteSubmitButtonComponent } from '../shared-module/tx-quote-submit-button/tx-quote-submit-button.component';

@NgModule({
  declarations: [
    ChangeIndicatorComponent,
    CopyButtonComponent,
    HelpButtonComponent,
    QrCodeComponent,
    CopyAddressComponent,
    TokenIconComponent,
    TokenIconsComponent,
    NumberComponent,
    ThemeToggleComponent,
    TokenNativeChainBadgeComponent,
    TxQuoteSubmitButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    ClipboardModule,
    SharedPipesModule,
    QrCodeModule
  ],
  exports: [
    ChangeIndicatorComponent,
    CopyButtonComponent,
    MatIconModule,
    MatButtonModule,
    ChangeIndicatorComponent,
    HelpButtonComponent,
    QrCodeComponent,
    CopyAddressComponent,
    TokenIconComponent,
    TokenIconsComponent,
    NumberComponent,
    ThemeToggleComponent,
    TokenNativeChainBadgeComponent,
    TxQuoteSubmitButtonComponent
  ]
})
export class SharedModule { }
