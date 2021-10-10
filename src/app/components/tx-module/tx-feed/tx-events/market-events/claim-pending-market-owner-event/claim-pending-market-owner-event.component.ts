import { Component, Input, OnInit } from '@angular/core';
import { IClaimPendingDeployerOwnershipEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/deployers/claim-pending-deployer-ownership-event.interface';
import { IClaimPendingMarketOwnershipEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/markets/claim-pending-market-ownership-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-claim-pending-market-owner-event',
  templateUrl: './claim-pending-market-owner-event.component.html',
  styleUrls: ['./claim-pending-market-owner-event.component.scss']
})
export class ClaimPendingMarketOwnerEventComponent implements OnInit {
  @Input() txEvent: ITransactionEvent;
  event: IClaimPendingMarketOwnershipEvent;

  ngOnInit(): void {
    this.event = this.txEvent as IClaimPendingDeployerOwnershipEvent;
  }
}
