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
  intro = true;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    // Wait 1 second before changing the green check icon to a spinning loader
    setTimeout(() => this.intro = false, 1000);
  }

  close(): void {
    this.data.dismiss();
  }
}
