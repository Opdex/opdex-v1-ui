import { Component, Input, OnInit } from '@angular/core';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-set-pending-deployer-owner-event',
  templateUrl: './set-pending-deployer-owner-event.component.html',
  styleUrls: ['./set-pending-deployer-owner-event.component.scss']
})
export class SetPendingDeployerOwnerEventComponent implements OnInit {

  constructor() { }

  @Input() txEvent: ITransactionEvent;

  ngOnInit(): void {
  }

}
