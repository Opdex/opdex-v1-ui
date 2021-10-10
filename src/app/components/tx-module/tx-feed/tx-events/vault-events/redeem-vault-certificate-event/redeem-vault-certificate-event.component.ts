import { Component, Injector, Input } from '@angular/core';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { IRedeemVaultCertificateEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vaults/redeem-vault-certificate-event.interface';
import { IVault } from '@sharedModels/platform-api/responses/vaults/vault.interface';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

  constructor(public _vaultService: VaultsService, protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IRedeemVaultCertificateEvent;
    this.token$ = this.getToken$(this.event.contract);
    this.token$ = this._vaultService.getVault().pipe(switchMap((vault: IVault) => this.getToken$(vault.lockedToken)));
  }
}
