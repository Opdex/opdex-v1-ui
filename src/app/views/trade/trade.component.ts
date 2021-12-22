import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { ISidenavMessage, TransactionView } from '@sharedModels/transaction-view';
import { Component } from '@angular/core';

@Component({
  selector: 'opdex-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent {
  message: ISidenavMessage;

  constructor(private _sidebar: SidenavService) {
    this.setMessage(TransactionView.swap);
    this._sidebar.closeSidenav();
  }

  handleTxOption($event: TransactionView) {
    this.setMessage($event);
  }

  private setMessage(view: TransactionView) {
    this.message = { view } as ISidenavMessage;
  }
}
