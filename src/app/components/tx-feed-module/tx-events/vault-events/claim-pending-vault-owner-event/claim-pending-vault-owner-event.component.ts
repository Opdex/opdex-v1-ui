import { Component, Injector, Input, OnInit } from '@angular/core';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { IClaimPendingVaultOwnershipEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vaults/claim-pending-vault-ownership-event.interface';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-claim-pending-vault-owner-event',
  templateUrl: './claim-pending-vault-owner-event.component.html',
  styleUrls: ['./claim-pending-vault-owner-event.component.scss']
})
export class ClaimPendingVaultOwnerEventComponent extends TxEventBaseComponent implements OnInit {

  @Input() txEvent: ITransactionEvent;
  event: IClaimPendingVaultOwnershipEvent;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.event = this.txEvent as IClaimPendingVaultOwnershipEvent;
  }
}
