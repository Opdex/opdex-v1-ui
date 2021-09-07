import { Component, Injector, Input } from '@angular/core';
import { IToken } from '@sharedModels/responses/platform-api/tokens/token.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { ICreateVaultCertificateEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/vaults/create-vault-certificate-event.interface';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-create-vault-certificate-event',
  templateUrl: './create-vault-certificate-event.component.html',
  styleUrls: ['./create-vault-certificate-event.component.scss']
})
export class CreateVaultCertificateEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: ICreateVaultCertificateEvent;
  token$: Observable<IToken>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as ICreateVaultCertificateEvent;
    this.token$ = this.getToken$(this.event.contract);
  }
}
