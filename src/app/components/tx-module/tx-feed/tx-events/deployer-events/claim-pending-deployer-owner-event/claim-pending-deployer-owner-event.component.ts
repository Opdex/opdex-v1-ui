import { Component, Input, OnInit } from '@angular/core';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-claim-pending-deployer-owner-event',
  templateUrl: './claim-pending-deployer-owner-event.component.html',
  styleUrls: ['./claim-pending-deployer-owner-event.component.scss']
})
export class ClaimPendingDeployerOwnerEventComponent implements OnInit {

  constructor() { }

  @Input() txEvent: ITransactionEvent;

  ngOnInit(): void {
  }

}
