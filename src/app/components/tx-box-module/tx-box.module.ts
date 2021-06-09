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

import { TxBoxSwapComponent } from './tx-box-swap/tx-box-swap.component';
import { TxBoxProvideComponent } from './tx-box-provide/tx-box-provide.component';
import { TxBoxMineComponent } from './tx-box-mine/tx-box-mine.component';
import { TxBoxStakeComponent } from './tx-box-stake/tx-box-stake.component';


@NgModule({
  declarations: [
    TxBoxSwapComponent,
    TxBoxProvideComponent,
    TxBoxMineComponent,
    TxBoxStakeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatDividerModule
  ],
  exports: [
    TxBoxSwapComponent,
    TxBoxProvideComponent,
    TxBoxMineComponent,
    TxBoxStakeComponent
  ]
})
export class TxBoxModule { }
