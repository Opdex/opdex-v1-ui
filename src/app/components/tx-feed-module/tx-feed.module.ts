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

import { AddLiquidityEventComponent } from './tx-events/liquidity-pool-events/add-liquidity-event/add-liquidity-event.component';
import { ClaimPendingDeployerOwnerEventComponent } from './tx-events/deployer-events/claim-pending-deployer-owner-event/claim-pending-deployer-owner-event.component';
import { CreateMarketEventComponent } from './tx-events/deployer-events/create-market-event/create-market-event.component';
import { SetPendingDeployerOwnerEventComponent } from './tx-events/deployer-events/set-pending-deployer-owner-event/set-pending-deployer-owner-event.component';
import { NominationEventComponent } from './tx-events/governance-events/nomination-event/nomination-event.component';
import { RewardMiningPoolEventComponent } from './tx-events/governance-events/reward-mining-pool-event/reward-mining-pool-event.component';
import { CollectStakingRewardsEventComponent } from './tx-events/liquidity-pool-events/collect-staking-rewards-event/collect-staking-rewards-event.component';
import { RemoveLiquidityEventComponent } from './tx-events/liquidity-pool-events/remove-liquidity-event/remove-liquidity-event.component';
import { StartStakingEventComponent } from './tx-events/liquidity-pool-events/start-staking-event/start-staking-event.component';
import { StopStakingEventComponent } from './tx-events/liquidity-pool-events/stop-staking-event/stop-staking-event.component';
import { SwapEventComponent } from './tx-events/liquidity-pool-events/swap-event/swap-event.component';
import { ChangeMarketPermissionEventComponent } from './tx-events/market-events/change-market-permission-event/change-market-permission-event.component';
import { ClaimPendingMarketOwnerEventComponent } from './tx-events/market-events/claim-pending-market-owner-event/claim-pending-market-owner-event.component';
import { CreateLiquidityPoolEventComponent } from './tx-events/market-events/create-liquidity-pool-event/create-liquidity-pool-event.component';
import { SetPendingMarketOwnerEventComponent } from './tx-events/market-events/set-pending-market-owner-event/set-pending-market-owner-event.component';
import { CollectMiningRewardsEventComponent } from './tx-events/mining-pool-events/collect-mining-rewards-event/collect-mining-rewards-event.component';
import { EnableMiningEventComponent } from './tx-events/mining-pool-events/enable-mining-event/enable-mining-event.component';
import { StartMiningEventComponent } from './tx-events/mining-pool-events/start-mining-event/start-mining-event.component';
import { StopMiningEventComponent } from './tx-events/mining-pool-events/stop-mining-event/stop-mining-event.component';
import { ApprovalEventComponent } from './tx-events/token-events/approval-event/approval-event.component';
import { DistributionEventComponent } from './tx-events/token-events/distribution-event/distribution-event.component';
import { TransferEventComponent } from './tx-events/token-events/transfer-event/transfer-event.component';
import { ClaimPendingVaultOwnerEventComponent } from './tx-events/vault-events/claim-pending-vault-owner-event/claim-pending-vault-owner-event.component';
import { CreateVaultCertificateEventComponent } from './tx-events/vault-events/create-vault-certificate-event/create-vault-certificate-event.component';
import { RedeemVaultCertificateEventComponent } from './tx-events/vault-events/redeem-vault-certificate-event/redeem-vault-certificate-event.component';
import { RevokeVaultCertificateEventComponent } from './tx-events/vault-events/revoke-vault-certificate-event/revoke-vault-certificate-event.component';
import { SetPendingVaultOwnerEventComponent } from './tx-events/vault-events/set-pending-vault-owner-event/set-pending-vault-owner-event.component';
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

@NgModule({
  declarations: [
    TxFeedComponent,
    SwapEventComponent,
    CollectStakingRewardsEventComponent,
    CollectMiningRewardsEventComponent,
    EnableMiningEventComponent,
    TransferEventComponent,
    DistributionEventComponent,
    ApprovalEventComponent,
    RedeemVaultCertificateEventComponent,
    RevokeVaultCertificateEventComponent,
    CreateVaultCertificateEventComponent,
    CreateLiquidityPoolEventComponent,
    ChangeMarketPermissionEventComponent,
    RewardMiningPoolEventComponent,
    NominationEventComponent,
    CreateMarketEventComponent,
    StartStakingEventComponent,
    StopStakingEventComponent,
    StopMiningEventComponent,
    StartMiningEventComponent,
    AddLiquidityEventComponent,
    RemoveLiquidityEventComponent,
    SetPendingDeployerOwnerEventComponent,
    ClaimPendingDeployerOwnerEventComponent,
    SetPendingMarketOwnerEventComponent,
    ClaimPendingMarketOwnerEventComponent,
    ClaimPendingVaultOwnerEventComponent,
    SetPendingVaultOwnerEventComponent,
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
    TxReceiptComponent
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
    SwapEventComponent,
    CollectStakingRewardsEventComponent,
    CollectMiningRewardsEventComponent,
    EnableMiningEventComponent,
    TransferEventComponent,
    DistributionEventComponent,
    ApprovalEventComponent,
    RedeemVaultCertificateEventComponent,
    RevokeVaultCertificateEventComponent,
    CreateVaultCertificateEventComponent,
    CreateLiquidityPoolEventComponent,
    ChangeMarketPermissionEventComponent,
    RewardMiningPoolEventComponent,
    NominationEventComponent,
    CreateMarketEventComponent,
    StartStakingEventComponent,
    StopStakingEventComponent,
    StopMiningEventComponent,
    StartMiningEventComponent,
    AddLiquidityEventComponent,
    RemoveLiquidityEventComponent,
    SetPendingDeployerOwnerEventComponent,
    ClaimPendingDeployerOwnerEventComponent,
    SetPendingMarketOwnerEventComponent,
    ClaimPendingMarketOwnerEventComponent,
    ClaimPendingVaultOwnerEventComponent,
    SetPendingVaultOwnerEventComponent,
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
    TxReceiptComponent
  ]
})
export class TxFeedModule { }
