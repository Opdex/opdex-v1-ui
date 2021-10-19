import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-transaction-broadcast-notification',
  templateUrl: './transaction-broadcast-notification.component.html',
  styleUrls: ['./transaction-broadcast-notification.component.scss']
})
export class TransactionBroadcastNotificationComponent {
  icons = Icons;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  close(): void {
    this.data.dismiss();
  }
}
