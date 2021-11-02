import { TransactionView } from '@sharedModels/transaction-view';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'opdex-tx-buttons',
  templateUrl: './tx-buttons.component.html',
  styleUrls: ['./tx-buttons.component.scss']
})
export class TxButtonsComponent {
  @Output() onSelectOption = new EventEmitter<TransactionView>();
  @Input() disableStaking = false;
  @Input() disableMining = false;
  @Input() hideStaking = false;
  @Input() hideMining = false;

  icons = Icons;
  iconSizes = IconSizes;
  transactionViews = TransactionView;

  selectOption(option: TransactionView) {
    this.onSelectOption.emit(option);
  }
}
