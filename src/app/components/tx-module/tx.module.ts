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
    TxProvideRemoveComponent
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
    MatDividerModule,
    MatButtonToggleModule
  ],
  exports: [
    TxSwapComponent,
    TxProvideComponent,
    TxMineComponent,
    TxStakeComponent
  ]
})
export class TransactionModule { }
