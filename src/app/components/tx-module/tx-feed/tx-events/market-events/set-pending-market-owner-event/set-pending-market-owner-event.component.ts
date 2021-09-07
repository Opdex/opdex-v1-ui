import { Component, Input } from '@angular/core';
import { ISetPendingMarketOwnershipEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/markets/set-pending-market-ownership-event.interfac';

@Component({
  selector: 'opdex-set-pending-market-owner-event',
  templateUrl: './set-pending-market-owner-event.component.html',
  styleUrls: ['./set-pending-market-owner-event.component.scss']
})
export class SetPendingMarketOwnerEventComponent{
   @Input() txEvent: ISetPendingMarketOwnershipEvent;
}
