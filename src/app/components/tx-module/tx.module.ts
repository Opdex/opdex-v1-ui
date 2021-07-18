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
import { ProvideEventComponent } from './tx-feed/tx-events/liquidity-pool-events/provide-event/provide-event.component';
import { SwapEventComponent } from './tx-feed/tx-events/liquidity-pool-events/swap-event/swap-event.component';
import { StakeEventComponent } from './tx-feed/tx-events/liquidity-pool-events/stake-event/stake-event.component';
import { CollectStakingRewardsEventComponent } from './tx-feed/tx-events/liquidity-pool-events/collect-staking-rewards-event/collect-staking-rewards-event.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CollectMiningRewardsEventComponent } from './tx-feed/tx-events/mining-pool-events/collect-mining-rewards-event/collect-mining-rewards-event.component';
import { MineEventComponent } from './tx-feed/tx-events/mining-pool-events/mine-event/mine-event.component';
import { EnableMiningEventComponent } from './tx-feed/tx-events/mining-pool-events/enable-mining-event/enable-mining-event.component';
import { TransferEventComponent } from './tx-feed/tx-events/token-events/transfer-event/transfer-event.component';
import { DistributionEventComponent } from './tx-feed/tx-events/token-events/distribution-event/distribution-event.component';
import { ApprovalEventComponent } from './tx-feed/tx-events/token-events/approval-event/approval-event.component';
import { ChangeVaultOwnerEventComponent } from './tx-feed/tx-events/vault-events/change-vault-owner-event/change-vault-owner-event.component';
import { RedeemVaulCertificateEventComponent } from './tx-feed/tx-events/vault-events/redeem-vaul-certificate-event/redeem-vaul-certificate-event.component';
import { RevokeVaulCertificateEventComponent } from './tx-feed/tx-events/vault-events/revoke-vaul-certificate-event/revoke-vaul-certificate-event.component';
import { CreateVaulCertificateEventComponent } from './tx-feed/tx-events/vault-events/create-vaul-certificate-event/create-vaul-certificate-event.component';
import { ChangeMarketOwnerEventComponent } from './tx-feed/tx-events/market-events/change-market-owner-event/change-market-owner-event.component';
import { CreateLiquidityPoolEventComponent } from './tx-feed/tx-events/market-events/create-liquidity-pool-event/create-liquidity-pool-event.component';
import { ChangeMarketPermissionEventComponent } from './tx-feed/tx-events/market-events/change-market-permission-event/change-market-permission-event.component';
import { RewardMiningPoolEventComponent } from './tx-feed/tx-events/governance-events/reward-mining-pool-event/reward-mining-pool-event.component';
import { NominationEventComponent } from './tx-feed/tx-events/governance-events/nomination-event/nomination-event.component';
import { ChangeDeployerOwnerEventComponent } from './tx-feed/tx-events/deployer-events/change-deployer-owner-event/change-deployer-owner-event.component';
import { CreateMarketEventComponent } from './tx-feed/tx-events/deployer-events/create-market-event/create-market-event.component';


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
    ProvideEventComponent,
    SwapEventComponent,
    StakeEventComponent,
    CollectStakingRewardsEventComponent,
    CollectMiningRewardsEventComponent,
    MineEventComponent,
    EnableMiningEventComponent,
    TransferEventComponent,
    DistributionEventComponent,
    ApprovalEventComponent,
    ChangeVaultOwnerEventComponent,
    RedeemVaulCertificateEventComponent,
    RevokeVaulCertificateEventComponent,
    CreateVaulCertificateEventComponent,
    ChangeMarketOwnerEventComponent,
    CreateLiquidityPoolEventComponent,
    ChangeMarketPermissionEventComponent,
    RewardMiningPoolEventComponent,
    NominationEventComponent,
    ChangeDeployerOwnerEventComponent,
    CreateMarketEventComponent
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
    SharedPipesModule,
    ClipboardModule,
  ],
  exports: [
    TxSwapComponent,
    TxProvideComponent,
    TxMineComponent,
    TxStakeComponent,
    TxAllowanceComponent,
    TxFeedComponent
  ]
})
export class TransactionModule { }
