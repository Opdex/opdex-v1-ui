import { SharedPipesModule } from './../../pipes/shared-pipes.module';
import { SharedModule } from '@sharedComponents/shared-module/shared.module';
import { ChartsModule } from './../charts-module/charts.module';
import { CardsModule } from '@sharedComponents/cards-module/cards.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoolsTableComponent } from './pools-table/pools-table.component';
import { TokensTableComponent } from './tokens-table/tokens-table.component';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';
import { VaultCertificatesTableComponent } from './vault-certificates-table/vault-certificates-table.component';

@NgModule({
  declarations: [
    PoolsTableComponent,
    TokensTableComponent,
    TransactionsTableComponent,
    VaultCertificatesTableComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CardsModule,
    ChartsModule,
    SharedModule,
    SharedPipesModule
  ],
  exports: [
    PoolsTableComponent,
    TokensTableComponent,
    TransactionsTableComponent,
    VaultCertificatesTableComponent
  ]
})
export class TablesModule { }
