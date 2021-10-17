import { Component, Input, OnInit } from '@angular/core';
import { ISetPendingMarketOwnershipEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/markets/set-pending-market-ownership-event.interfac';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-set-pending-market-owner-event',
  templateUrl: './set-pending-market-owner-event.component.html',
  styleUrls: ['./set-pending-market-owner-event.component.scss']
})
export class SetPendingMarketOwnerEventComponent implements OnInit{
  @Input() txEvent: ITransactionEvent;
  event: ISetPendingMarketOwnershipEvent;

  ngOnInit(): void {
    this.event = this.txEvent as ISetPendingMarketOwnershipEvent;
  }
}
