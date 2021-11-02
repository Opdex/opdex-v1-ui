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
import { WalletLiquidityPoolPositionTableComponent } from './wallet-liquidity-pool-position-table/wallet-liquidity-pool-position-table.component';
import { WalletMiningPositionsTableComponent } from './wallet-mining-positions-table/wallet-mining-positions-table.component';
import { WalletStakingPositionsTableComponent } from './wallet-staking-positions-table/wallet-staking-positions-table.component';

@NgModule({
  declarations: [
    PoolsTableComponent,
    TokensTableComponent,
    VaultCertificatesTableComponent,
    WalletBalancesTableComponent,
    WalletLiquidityPoolPositionTableComponent,
    WalletMiningPositionsTableComponent,
    WalletStakingPositionsTableComponent
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
    SharedPipesModule
  ],
  exports: [
    PoolsTableComponent,
    TokensTableComponent,
    VaultCertificatesTableComponent,
    WalletBalancesTableComponent,
    WalletLiquidityPoolPositionTableComponent,
    WalletMiningPositionsTableComponent,
    WalletStakingPositionsTableComponent
  ]
})
export class TablesModule { }
