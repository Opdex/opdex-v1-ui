import { Component, Input } from '@angular/core';
import { IClaimPendingDeployerOwnershipEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/deployers/claim-pending-deployer-ownership-event.interface';

@Component({
  selector: 'opdex-claim-pending-deployer-owner-event',
  templateUrl: './claim-pending-deployer-owner-event.component.html',
  styleUrls: ['./claim-pending-deployer-owner-event.component.scss']
})
export class ClaimPendingDeployerOwnerEventComponent {

  @Input() txEvent: IClaimPendingDeployerOwnershipEvent;
  
}
