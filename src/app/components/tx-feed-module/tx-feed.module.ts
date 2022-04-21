import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@sharedComponents/shared-module/shared.module';
import { SharedPipesModule } from '@sharedPipes/shared-pipes.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CardsModule } from '@sharedComponents/cards-module/cards.module';

import { TxFeedComponent } from './tx-feed/tx-feed.component';
import { AllowanceTransactionSummaryComponent } from './tx-summaries/allowance-transaction-summary/allowance-transaction-summary.component';
import { CreatePoolTransactionSummaryComponent } from './tx-summaries/create-pool-transaction-summary/create-pool-transaction-summary.component';
import { DistributeTransactionSummaryComponent } from './tx-summaries/distribute-transaction-summary/distribute-transaction-summary.component';
import { EnableMiningTransactionSummaryComponent } from './tx-summaries/enable-mining-transaction-summary/enable-mining-transaction-summary.component';
import { MineTransactionSummaryComponent } from './tx-summaries/mine-transaction-summary/mine-transaction-summary.component';
import { OwnershipTransactionSummaryComponent } from './tx-summaries/ownership-transaction-summary/ownership-transaction-summary.component';
import { PermissionsTransactionSummaryComponent } from './tx-summaries/permissions-transaction-summary/permissions-transaction-summary.component';
import { ProvideTransactionSummaryComponent } from './tx-summaries/provide-transaction-summary/provide-transaction-summary.component';
import { StakeTransactionSummaryComponent } from './tx-summaries/stake-transaction-summary/stake-transaction-summary.component';
import { SwapTransactionSummaryComponent } from './tx-summaries/swap-transaction-summary/swap-transaction-summary.component';
import { VaultCertificateTransactionSummaryComponent } from './tx-summaries/vault-certificate-transaction-summary/vault-certificate-transaction-summary.component';
import { TxReceiptComponent } from './tx-receipt/tx-receipt.component';
import { VaultProposalTransactionSummaryComponent } from './tx-summaries/vault-proposal-transaction-summary/vault-proposal-transaction-summary.component';

@NgModule({
  declarations: [
    TxFeedComponent,
    SwapTransactionSummaryComponent,
    ProvideTransactionSummaryComponent,
    MineTransactionSummaryComponent,
    StakeTransactionSummaryComponent,
    CreatePoolTransactionSummaryComponent,
    EnableMiningTransactionSummaryComponent,
    DistributeTransactionSummaryComponent,
    VaultCertificateTransactionSummaryComponent,
    OwnershipTransactionSummaryComponent,
    PermissionsTransactionSummaryComponent,
    AllowanceTransactionSummaryComponent,
    TxReceiptComponent,
    VaultProposalTransactionSummaryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    SharedPipesModule,
    ClipboardModule,
    SharedModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    CardsModule,
  ],
  exports: [
    TxFeedComponent,
    SwapTransactionSummaryComponent,
    ProvideTransactionSummaryComponent,
    MineTransactionSummaryComponent,
    StakeTransactionSummaryComponent,
    CreatePoolTransactionSummaryComponent,
    EnableMiningTransactionSummaryComponent,
    DistributeTransactionSummaryComponent,
    VaultCertificateTransactionSummaryComponent,
    OwnershipTransactionSummaryComponent,
    PermissionsTransactionSummaryComponent,
    AllowanceTransactionSummaryComponent,
    TxReceiptComponent,
    SharedModule
  ]
})
export class TxFeedModule { }
