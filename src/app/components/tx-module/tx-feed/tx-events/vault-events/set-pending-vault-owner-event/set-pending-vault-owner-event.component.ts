import { Component, Input, OnInit } from '@angular/core';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { ISetPendingVaultOwnershipEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/vaults/set-pending-vault-ownership-event.interfac';

@Component({
  selector: 'opdex-set-pending-vault-owner-event',
  templateUrl: './set-pending-vault-owner-event.component.html',
  styleUrls: ['./set-pending-vault-owner-event.component.scss']
})
export class SetPendingVaultOwnerEventComponent implements OnInit {

  @Input() txEvent: ITransactionEvent;
  event: ISetPendingVaultOwnershipEvent;

  ngOnInit(): void {
    this.event = this.txEvent as ISetPendingVaultOwnershipEvent;
  }
}
