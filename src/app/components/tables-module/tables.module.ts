import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PairsTableComponent } from './pairs-table/pairs-table.component';
import { TokensTableComponent } from './tokens-table/tokens-table.component';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';

@NgModule({
  declarations: [
    PairsTableComponent,
    TokensTableComponent,
    TransactionsTableComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  exports: [
    PairsTableComponent,
    TokensTableComponent,
    TransactionsTableComponent
  ]
})
export class TablesModule { }
