import { Component, Input, OnInit } from '@angular/core';
import { IClaimPendingDeployerOwnershipEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/deployers/claim-pending-deployer-ownership-event.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { IClaimPendingVaultOwnershipEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/vaults/claim-pending-vault-ownership-event.interface';

@Component({
  selector: 'opdex-claim-pending-deployer-owner-event',
  templateUrl: './claim-pending-deployer-owner-event.component.html',
  styleUrls: ['./claim-pending-deployer-owner-event.component.scss']
})
export class ClaimPendingDeployerOwnerEventComponent implements OnInit {
  @Input() txEvent: ITransactionEvent;
  event: IClaimPendingDeployerOwnershipEvent;
  
  ngOnInit(): void {
    this.event = this.txEvent as IClaimPendingVaultOwnershipEvent
  }
}
