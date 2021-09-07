import { Component, Injector, Input } from '@angular/core';
import { IToken } from '@sharedModels/responses/platform-api/tokens/token.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { IRevokeVaultCertificateEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/vaults/revoke-vault-certificate-event.interface';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-revoke-vault-certificate-event',
  templateUrl: './revoke-vault-certificate-event.component.html',
  styleUrls: ['./revoke-vault-certificate-event.component.scss']
})
export class RevokeVaultCertificateEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IRevokeVaultCertificateEvent;
  token$: Observable<IToken>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IRevokeVaultCertificateEvent;
    this.token$ = this.getToken$(this.event.contract);
  }
}
