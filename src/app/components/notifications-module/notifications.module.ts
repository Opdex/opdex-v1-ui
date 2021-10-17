import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TxFeedModule } from './../tx-feed-module/tx-feed.module';
import { TransactionBroadcastNotificationComponent } from './transaction-broadcast-notification/transaction-broadcast-notification.component';
import { TransactionMinedNotificationComponent } from './transaction-mined-notification/transaction-mined-notification.component';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    TransactionBroadcastNotificationComponent,
    TransactionMinedNotificationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TxFeedModule
  ]
})
export class NotificationsModule { }
