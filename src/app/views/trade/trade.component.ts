import { ISidenavMessage, TransactionView } from '@sharedModels/transaction-view';
import { Component } from '@angular/core';

@Component({
  selector: 'opdex-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent {
  message: ISidenavMessage;

  constructor() {
    this.setMessage(TransactionView.swap);
  }

  handleTxOption($event: TransactionView) {
    this.setMessage($event);
  }

  private setMessage(view: TransactionView) {
    this.message = { view } as ISidenavMessage;
  }
}
