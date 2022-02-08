import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { TransactionReceipt } from '@sharedModels/ui/transactions/transaction-receipt';
import { Component, Input } from '@angular/core';
import { CollapseAnimation } from '@sharedServices/animations/collapse';

@Component({
  selector: 'opdex-tx-receipt',
  templateUrl: './tx-receipt.component.html',
  styleUrls: ['./tx-receipt.component.scss'],
  animations: [CollapseAnimation]
})
export class TxReceiptComponent {
  @Input() tx: TransactionReceipt;
  @Input() showBottomDivider: boolean = false;
  @Input() showTimeAgo: boolean = true;
  @Input() collapsed = true;

  icons = Icons;
  iconSizes = IconSizes;

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  copyHandler(event): void {
    event.stopPropagation();
  }
}
