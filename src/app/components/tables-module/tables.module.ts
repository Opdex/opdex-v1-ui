import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SharedPipesModule } from '@sharedPipes/shared-pipes.module';
import { SharedModule } from '@sharedComponents/shared-module/shared.module';
import { ChartsModule } from './../charts-module/charts.module';
import { CardsModule } from '@sharedComponents/cards-module/cards.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoolsTableComponent } from './pools-table/pools-table.component';
import { TokensTableComponent } from './tokens-table/tokens-table.component';
import { VaultCertificatesTableComponent } from './vault-certificates-table/vault-certificates-table.component';
import { WalletBalancesTableComponent } from './wallet-balances-table/wallet-balances-table.component';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WalletMiningPositionsTableComponent } from './wallet-mining-positions-table/wallet-mining-positions-table.component';
import { WalletStakingPositionsTableComponent } from './wallet-staking-positions-table/wallet-staking-positions-table.component';
import { WalletProvisioningPositionsTableComponent } from './wallet-provisioning-positions-table/wallet-provisioning-positions-table.component';
import { SkeletonTableComponent } from './skeleton-table/skeleton-table.component';
import { VaultProposalPledgesTableComponent } from './vault-proposal-pledges-table/vault-proposal-pledges-table.component';
import { VaultProposalVotesTableComponent } from './vault-proposal-votes-table/vault-proposal-votes-table.component';
import { VaultProposalsTableComponent } from './vault-proposals-table/vault-proposals-table.component';

@NgModule({
  declarations: [
    PoolsTableComponent,
    TokensTableComponent,
    VaultCertificatesTableComponent,
    WalletBalancesTableComponent,
    WalletMiningPositionsTableComponent,
    WalletStakingPositionsTableComponent,
    WalletProvisioningPositionsTableComponent,
    SkeletonTableComponent,
    VaultProposalPledgesTableComponent,
    VaultProposalVotesTableComponent,
    VaultProposalsTableComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatMenuModule,
    CardsModule,
    ChartsModule,
    SharedModule,
    SharedPipesModule,
    RouterModule
  ],
  exports: [
    PoolsTableComponent,
    TokensTableComponent,
    VaultCertificatesTableComponent,
    WalletBalancesTableComponent,
    WalletMiningPositionsTableComponent,
    WalletStakingPositionsTableComponent,
    WalletProvisioningPositionsTableComponent,
    VaultProposalPledgesTableComponent,
    VaultProposalVotesTableComponent,
    VaultProposalsTableComponent
  ]
})
export class TablesModule { }
