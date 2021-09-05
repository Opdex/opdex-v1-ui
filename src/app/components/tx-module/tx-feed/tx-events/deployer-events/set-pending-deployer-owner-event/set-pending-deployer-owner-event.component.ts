import { Component, Input } from '@angular/core';
import { ISetPendingDeployerOwnershipEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/deployers/set-pending-deployer-ownership-event.interfac';

@Component({
  selector: 'opdex-set-pending-deployer-owner-event',
  templateUrl: './set-pending-deployer-owner-event.component.html',
  styleUrls: ['./set-pending-deployer-owner-event.component.scss']
})
export class SetPendingDeployerOwnerEventComponent {

  @Input() txEvent: ISetPendingDeployerOwnershipEvent;

}
