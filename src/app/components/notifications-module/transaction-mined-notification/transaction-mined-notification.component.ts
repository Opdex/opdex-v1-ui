import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Icons } from 'src/app/enums/icons';
import { CollapseAnimation } from '@sharedServices/animations/collapse';
import { IconSizes } from 'src/app/enums/icon-sizes';

@Component({
  selector: 'opdex-transaction-mined-notification',
  templateUrl: './transaction-mined-notification.component.html',
  styleUrls: ['./transaction-mined-notification.component.scss'],
  animations: [CollapseAnimation]
})
export class TransactionMinedNotificationComponent {
  icons = Icons;
  iconSizes = IconSizes
  transaction: TransactionReceipt;
  collapsed: boolean = true;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.transaction = data.transaction;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  close(): void {
    this.data.dismiss();
  }
}
