import { Component, Input, OnInit } from '@angular/core';
import { ISetPendingDeployerOwnershipEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/deployers/set-pending-deployer-ownership-event.interfac';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-set-pending-deployer-owner-event',
  templateUrl: './set-pending-deployer-owner-event.component.html',
  styleUrls: ['./set-pending-deployer-owner-event.component.scss']
})
export class SetPendingDeployerOwnerEventComponent implements OnInit {
  @Input() txEvent: ITransactionEvent;
  event: ISetPendingDeployerOwnershipEvent;

  ngOnInit(): void {
    this.event = this.txEvent as ISetPendingDeployerOwnershipEvent;
  }
}
