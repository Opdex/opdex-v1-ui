import { UserContextService } from '@sharedServices/user-context.service';
import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'opdex-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  transactionsRequest: ITransactionsRequest
  wallet: string;

  constructor(private _context: UserContextService) {
    this.wallet = this._context.getUserContext().wallet;
  }

  ngOnInit(): void {
    this.transactionsRequest = {
      limit: 25,
      direction: "DESC",
      eventTypes: [],
      wallet: this.wallet
    };
  }
}
