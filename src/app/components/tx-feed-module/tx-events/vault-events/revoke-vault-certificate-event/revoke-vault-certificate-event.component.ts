import { Component, Injector, Input } from '@angular/core';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { IRevokeVaultCertificateEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vaults/revoke-vault-certificate-event.interface';
import { IVaultResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-response-model.interface';
import { Token } from '@sharedModels/ui/tokens/token';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-revoke-vault-certificate-event',
  templateUrl: './revoke-vault-certificate-event.component.html',
  styleUrls: ['./revoke-vault-certificate-event.component.scss']
})
export class RevokeVaultCertificateEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IRevokeVaultCertificateEvent;
  token$: Observable<Token>;

  constructor(public _vaultService: VaultsService, protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IRevokeVaultCertificateEvent;
    this.token$ = this._vaultService.getVault().pipe(switchMap((vault: IVaultResponseModel) => this.getToken$(vault.tokensLocked)));
  }
}
