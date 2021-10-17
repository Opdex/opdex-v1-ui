import { Component, Injector, Input, OnInit } from '@angular/core';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { ISetPendingVaultOwnershipEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vaults/set-pending-vault-ownership-event.interfac';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-set-pending-vault-owner-event',
  templateUrl: './set-pending-vault-owner-event.component.html',
  styleUrls: ['./set-pending-vault-owner-event.component.scss']
})
export class SetPendingVaultOwnerEventComponent extends TxEventBaseComponent implements OnInit {

  @Input() txEvent: ITransactionEvent;
  event: ISetPendingVaultOwnershipEvent;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.event = this.txEvent as ISetPendingVaultOwnershipEvent;
  }
}
