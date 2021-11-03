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
    this.message = {
      view: TransactionView.swap,
      data: { }
    } as ISidenavMessage;
  }

  handleTxOption($event: TransactionView) {
    this.message = {
      view: $event,
      data: { }
    } as ISidenavMessage;
  }
}
