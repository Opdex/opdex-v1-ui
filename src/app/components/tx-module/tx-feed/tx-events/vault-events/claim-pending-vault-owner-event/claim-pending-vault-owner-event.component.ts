import { Component, Input, OnInit } from '@angular/core';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { IClaimPendingVaultOwnershipEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/vaults/claim-pending-vault-ownership-event.interface';

@Component({
  selector: 'opdex-claim-pending-vault-owner-event',
  templateUrl: './claim-pending-vault-owner-event.component.html',
  styleUrls: ['./claim-pending-vault-owner-event.component.scss']
})
export class ClaimPendingVaultOwnerEventComponent implements OnInit {

  @Input() txEvent: ITransactionEvent;
  event: IClaimPendingVaultOwnershipEvent;

  ngOnInit(): void {
    this.event = this.txEvent as IClaimPendingVaultOwnershipEvent;
  }
}
