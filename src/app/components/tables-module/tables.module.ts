import { MatIconModule } from '@angular/material/icon';
import { SharedPipesModule } from './../../pipes/shared-pipes.module';
import { SharedModule } from '@sharedComponents/shared-module/shared.module';
import { ChartsModule } from './../charts-module/charts.module';
import { CardsModule } from '@sharedComponents/cards-module/cards.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoolsTableComponent } from './pools-table/pools-table.component';
import { TokensTableComponent } from './tokens-table/tokens-table.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';
import { VaultCertificatesTableComponent } from './vault-certificates-table/vault-certificates-table.component';
import { WalletBalancesTableComponent } from './wallet-balances-table/wallet-balances-table.component';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    PoolsTableComponent,
    TokensTableComponent,
    TransactionsTableComponent,
    VaultCertificatesTableComponent,
    WalletBalancesTableComponent
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
    CardsModule,
    ChartsModule,
    SharedModule,
    SharedPipesModule
  ],
  exports: [
    PoolsTableComponent,
    TokensTableComponent,
    TransactionsTableComponent,
    VaultCertificatesTableComponent,
    WalletBalancesTableComponent
  ]
})
export class TablesModule { }
