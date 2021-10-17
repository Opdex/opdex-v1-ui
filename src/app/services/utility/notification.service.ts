import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionBroadcastNotificationComponent } from '@sharedComponents/notifications-module/transaction-broadcast-notification/transaction-broadcast-notification.component';
import { TransactionMinedNotificationComponent } from '@sharedComponents/notifications-module/transaction-mined-notification/transaction-mined-notification.component';

@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(private _snackbar: MatSnackBar) { }

  public pushBroadcastTransactionNotification(txHash: string) {
    this._snackbar.openFromComponent(TransactionBroadcastNotificationComponent, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['notification'],
      data: {
        txHash,
        dismiss: () => this._snackbar.dismiss()
      }
    });
  }

  public pushMinedTransactionNotification(transaction: TransactionReceipt) {
    this._snackbar.openFromComponent(TransactionMinedNotificationComponent, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['notification', 'p-0'],
      data: {
        transaction,
        dismiss: () => this._snackbar.dismiss()
      }
    });
  }
}
