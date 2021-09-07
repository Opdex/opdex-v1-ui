import { Component, Input } from '@angular/core';
import { IClaimPendingMarketOwnershipEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/markets/claim-pending-market-ownership-event.interface';

@Component({
  selector: 'opdex-claim-pending-market-owner-event',
  templateUrl: './claim-pending-market-owner-event.component.html',
  styleUrls: ['./claim-pending-market-owner-event.component.scss']
})
export class ClaimPendingMarketOwnerEventComponent {
  @Input() txEvent: IClaimPendingMarketOwnershipEvent;
}
