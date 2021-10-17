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
    setTimeout(() => {
      this.intro = false;
    }, 1000);
  }

  close() {
    this.data.dismiss();
  }
}
