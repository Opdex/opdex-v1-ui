import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from './../../pipes/shared-pipes.module';
import { CardsModule } from '@sharedComponents/cards-module/cards.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QRCodeModule } from 'angularx-qrcode';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import { TxSwapComponent } from './tx-swap/tx-swap.component';
import { TxProvideComponent } from './tx-provide/tx-provide.component';
import { TxMineComponent } from './tx-mine/tx-mine.component';
import { TxStakeComponent } from './tx-stake/tx-stake.component';
import { TxMineStartComponent } from './tx-mine/tx-mine-start/tx-mine-start.component';
import { TxMineStopComponent } from './tx-mine/tx-mine-stop/tx-mine-stop.component';
import { TxMineCollectComponent } from './tx-mine/tx-mine-collect/tx-mine-collect.component';
import { TxStakeCollectComponent } from './tx-stake/tx-stake-collect/tx-stake-collect.component';
import { TxStakeStartComponent } from './tx-stake/tx-stake-start/tx-stake-start.component';
import { TxStakeStopComponent } from './tx-stake/tx-stake-stop/tx-stake-stop.component';
import { TxProvideAddComponent } from './tx-provide/tx-provide-add/tx-provide-add.component';
import { TxProvideRemoveComponent } from './tx-provide/tx-provide-remove/tx-provide-remove.component';
import { TxAllowanceComponent } from './tx-allowance/tx-allowance.component';
import { PoolPreviewComponent } from './shared/pool-preview/pool-preview.component';
import { AllowanceValidationComponent } from './shared/allowance-validation/allowance-validation.component';

// Feed
import { TxFeedComponent } from '../tx-module/tx-feed/tx-feed.component';
import { SwapEventComponent } from './tx-feed/tx-events/liquidity-pool-events/swap-event/swap-event.component';
import { CollectStakingRewardsEventComponent } from './tx-feed/tx-events/liquidity-pool-events/collect-staking-rewards-event/collect-staking-rewards-event.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CollectMiningRewardsEventComponent } from './tx-feed/tx-events/mining-pool-events/collect-mining-rewards-event/collect-mining-rewards-event.component';
import { EnableMiningEventComponent } from './tx-feed/tx-events/mining-pool-events/enable-mining-event/enable-mining-event.component';
import { TransferEventComponent } from './tx-feed/tx-events/token-events/transfer-event/transfer-event.component';
import { DistributionEventComponent } from './tx-feed/tx-events/token-events/distribution-event/distribution-event.component';
import { ApprovalEventComponent } from './tx-feed/tx-events/token-events/approval-event/approval-event.component';
import { RedeemVaultCertificateEventComponent } from './tx-feed/tx-events/vault-events/redeem-vault-certificate-event/redeem-vault-certificate-event.component';
import { RevokeVaultCertificateEventComponent } from './tx-feed/tx-events/vault-events/revoke-vault-certificate-event/revoke-vault-certificate-event.component';
import { CreateVaultCertificateEventComponent } from './tx-feed/tx-events/vault-events/create-vault-certificate-event/create-vault-certificate-event.component';
import { CreateLiquidityPoolEventComponent } from './tx-feed/tx-events/market-events/create-liquidity-pool-event/create-liquidity-pool-event.component';
import { ChangeMarketPermissionEventComponent } from './tx-feed/tx-events/market-events/change-market-permission-event/change-market-permission-event.component';
import { RewardMiningPoolEventComponent } from './tx-feed/tx-events/governance-events/reward-mining-pool-event/reward-mining-pool-event.component';
import { NominationEventComponent } from './tx-feed/tx-events/governance-events/nomination-event/nomination-event.component';
import { CreateMarketEventComponent } from './tx-feed/tx-events/deployer-events/create-market-event/create-market-event.component';
import { StartStakingEventComponent } from './tx-feed/tx-events/liquidity-pool-events/start-staking-event/start-staking-event.component';
import { StopStakingEventComponent } from './tx-feed/tx-events/liquidity-pool-events/stop-staking-event/stop-staking-event.component';
import { StopMiningEventComponent } from './tx-feed/tx-events/mining-pool-events/stop-mining-event/stop-mining-event.component';
import { StartMiningEventComponent } from './tx-feed/tx-events/mining-pool-events/start-mining-event/start-mining-event.component';
import { AddLiquidityEventComponent } from './tx-feed/tx-events/liquidity-pool-events/add-liquidity-event/add-liquidity-event.component';
import { RemoveLiquidityEventComponent } from './tx-feed/tx-events/liquidity-pool-events/remove-liquidity-event/remove-liquidity-event.component';
import { SetPendingDeployerOwnerEventComponent } from './tx-feed/tx-events/deployer-events/set-pending-deployer-owner-event/set-pending-deployer-owner-event.component';
import { ClaimPendingDeployerOwnerEventComponent } from './tx-feed/tx-events/deployer-events/claim-pending-deployer-owner-event/claim-pending-deployer-owner-event.component';
import { SetPendingMarketOwnerEventComponent } from './tx-feed/tx-events/market-events/set-pending-market-owner-event/set-pending-market-owner-event.component';
import { ClaimPendingMarketOwnerEventComponent } from './tx-feed/tx-events/market-events/claim-pending-market-owner-event/claim-pending-market-owner-event.component';
import { ClaimPendingVaultOwnerEventComponent } from './tx-feed/tx-events/vault-events/claim-pending-vault-owner-event/claim-pending-vault-owner-event.component';
import { SetPendingVaultOwnerEventComponent } from './tx-feed/tx-events/vault-events/set-pending-vault-owner-event/set-pending-vault-owner-event.component';
import { SharedModule } from '@sharedComponents/shared-module/shared.module';
import { ControlsModule } from '@sharedComponents/controls-module/controls.module';
import { ReviewQuoteComponent } from './shared/review-quote/review-quote.component';
import { TxCreatePoolComponent } from './tx-create-pool/tx-create-pool.component';


@NgModule({
  declarations: [
    TxSwapComponent,
    TxProvideComponent,
    TxMineComponent,
    TxStakeComponent,
    TxMineStartComponent,
    TxMineStopComponent,
    TxMineCollectComponent,
    TxStakeCollectComponent,
    TxStakeStartComponent,
    TxStakeStopComponent,
    TxProvideAddComponent,
    TxProvideRemoveComponent,
    TxAllowanceComponent,
    PoolPreviewComponent,
    AllowanceValidationComponent,
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
    ReviewQuoteComponent,
    TxCreatePoolComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    QRCodeModule,
    SharedPipesModule,
    ClipboardModule,
    SharedModule,
    ControlsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule
  ],
  exports: [
    TxSwapComponent,
    TxProvideComponent,
    TxMineComponent,
    TxStakeComponent,
    TxAllowanceComponent,
    TxFeedComponent,
    SetPendingDeployerOwnerEventComponent,
    ClaimPendingDeployerOwnerEventComponent,
    CreateMarketEventComponent,
    TxCreatePoolComponent,
  ]
})
export class TransactionModule { }
