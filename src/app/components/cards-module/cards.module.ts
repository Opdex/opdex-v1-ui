import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from './../shared-module/shared.module';
import { SharedPipesModule } from '@sharedPipes/shared-pipes.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalsModule } from '@sharedComponents/modals-module/modals.module';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Module Components
import { CardComponent } from './card/card.component';
import { MiningCardComponent } from './mining-card/mining-card.component';
import { LiquidityPoolVolumeCardComponent } from './liquidity-pool-volume-card/liquidity-pool-volume-card.component';
import { StakingPoolCardComponent } from './staking-pool-card/staking-pool-card.component';
import { StatCardComponent } from './stat-card/stat-card.component';
import { LiquidityPoolTokenCardComponent } from './liquidity-pool-token-card/liquidity-pool-token-card.component';
import { MarketTokenCardComponent } from './market-token-card/market-token-card.component';
import { WalletPositionCardComponent } from './wallet-position-card/wallet-position-card.component';
import { VaultProposalCardComponent } from './vault-proposal-card/vault-proposal-card.component';
import { LiquidityPoolSummaryCardComponent } from './liquidity-pool-summary-card/liquidity-pool-summary-card.component';
import { TokenSummaryCardComponent } from './token-summary-card/token-summary-card.component';
import { MarketSummaryCardComponent } from './market-summary-card/market-summary-card.component';
import { VaultCertificateCardComponent } from './vault-certificate-card/vault-certificate-card.component';

@NgModule({
  declarations: [
    CardComponent,
    MiningCardComponent,
    LiquidityPoolVolumeCardComponent,
    StakingPoolCardComponent,
    StatCardComponent,
    LiquidityPoolTokenCardComponent,
    MarketTokenCardComponent,
    WalletPositionCardComponent,
    VaultProposalCardComponent,
    LiquidityPoolSummaryCardComponent,
    TokenSummaryCardComponent,
    MarketSummaryCardComponent,
    VaultCertificateCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    SharedPipesModule,
    SharedModule,
    ModalsModule,
    MatProgressBarModule,
    SharedModule,
    MatDividerModule
  ],
  exports: [
    CardComponent,
    MiningCardComponent,
    LiquidityPoolVolumeCardComponent,
    StakingPoolCardComponent,
    StatCardComponent,
    LiquidityPoolTokenCardComponent,
    MarketTokenCardComponent,
    WalletPositionCardComponent,
    VaultProposalCardComponent,
    LiquidityPoolSummaryCardComponent,
    TokenSummaryCardComponent,
    MarketSummaryCardComponent,
    VaultCertificateCardComponent
  ]
})
export class CardsModule { }
