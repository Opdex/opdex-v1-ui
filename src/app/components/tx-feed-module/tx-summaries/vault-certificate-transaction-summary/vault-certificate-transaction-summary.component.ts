import { MarketToken } from '@sharedModels/ui/tokens/market-token';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { switchMap } from 'rxjs/operators';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { IRedeemVaultCertificateEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/vaults/redeem-vault-certificate-event.interface';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { Subscription } from 'rxjs';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { OnDestroy, OnChanges } from '@angular/core';
import { Component, Input } from '@angular/core';
import { TransactionReceipt } from '@sharedModels/ui/transactions/transaction-receipt';

@Component({
  selector: 'opdex-vault-certificate-transaction-summary',
  templateUrl: './vault-certificate-transaction-summary.component.html',
  styleUrls: ['./vault-certificate-transaction-summary.component.scss']
})
export class VaultCertificateTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;
  subscription: Subscription;
  vaultToken: MarketToken;
  amount: FixedDecimal;
  error: string;
  event = TransactionEventTypes.RedeemVaultCertificateEvent;

  constructor(
    private _envService: EnvironmentsService,
    private _vaultsService: VaultsService,
    private _tokensService: TokensService
  ) { }

  ngOnChanges(): void {
    const event = this.transaction.events.find(event => this.event === event.eventType) as IRedeemVaultCertificateEvent;

    if (!event) {
      this.error = 'Unable to read redeem certificate transaction.';
      return;
    }

    if (!this.subscription || this.subscription.closed) {
      this.subscription = new Subscription();
      this.subscription.add(
        this._vaultsService.getVault(this._envService.vaultAddress)
          .pipe(switchMap(vault => this._tokensService.getMarketToken(vault.token)))
          .subscribe(token => {
            this.vaultToken = token;
            this.amount = new FixedDecimal(event.amount, this.vaultToken.decimals);
          }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
