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


import { TxBoxSwapComponent } from './tx-box-swap/tx-box-swap.component';
import { TxBoxSidebarComponent } from './tx-box-sidebar/tx-box-sidebar.component';
import { TxBoxAddLiquidityComponent } from './tx-box-add-liquidity/tx-box-add-liquidity.component';
import { TxBoxRemoveLiquidityComponent } from './tx-box-remove-liquidity/tx-box-remove-liquidity.component';
import { TxBoxComponent } from './tx-box/tx-box.component';

@NgModule({
  declarations: [
    TxBoxSwapComponent,
    TxBoxSidebarComponent,
    TxBoxAddLiquidityComponent,
    TxBoxRemoveLiquidityComponent,
    TxBoxComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule
  ],
  exports: [
    TxBoxSwapComponent,
    TxBoxSidebarComponent,
    TxBoxAddLiquidityComponent,
    TxBoxRemoveLiquidityComponent,
    TxBoxComponent
  ]
})
export class TxBoxModule { }
