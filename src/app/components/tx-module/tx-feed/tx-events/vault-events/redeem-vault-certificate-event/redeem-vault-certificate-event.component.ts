import { Component, Injector, Input } from '@angular/core';
import { IToken } from '@sharedModels/responses/platform-api/tokens/token.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { IRedeemVaultCertificateEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/vaults/redeem-vault-certificate-event.interface';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-redeem-vault-certificate-event',
  templateUrl: './redeem-vault-certificate-event.component.html',
  styleUrls: ['./redeem-vault-certificate-event.component.scss']
})
export class RedeemVaultCertificateEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IRedeemVaultCertificateEvent;
  token$: Observable<IToken>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IRedeemVaultCertificateEvent;
    this.token$ = this.getToken$(this.event.contract);
  }
}
