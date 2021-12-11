import { StatCardInfo } from '@sharedModels/stat-card-info';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap, switchMap, take } from 'rxjs/operators';
import { IVault } from '@sharedModels/platform-api/responses/vaults/vault.interface';
import { IVaultCertificates } from '@sharedModels/platform-api/responses/vaults/vault-certificate.interface';
import { Icons } from 'src/app/enums/icons';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { VaultStatCardsLookup } from '@sharedLookups/vault-stat-cards.lookup';

@Component({
  selector: 'opdex-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  vault: IVault;
  certificates: IVaultCertificates;
  icons = Icons;
  statCards: StatCardInfo[];

  constructor(
    private _vaultsService: VaultsService,
    private _tokensService: TokensService,
    private _blocksService: BlocksService
  ) {
    // Init with null to get default/loading animations
    this.statCards = VaultStatCardsLookup.getStatCards(null);
  }

  ngOnInit(): void {
    this.subscription.add(
      this._blocksService.getLatestBlock$().pipe(switchMap(_ => this._vaultsService.getVault()
        .pipe(
          tap(vault => this.vault = vault),
          switchMap(() => this._tokensService.getMarketToken(this.vault.lockedToken?.address || this.vault.lockedToken)),
          tap(token => this.vault.lockedToken = token),
          tap(_ => {
            this.statCards = VaultStatCardsLookup.getStatCards(this.vault);
          })))
        ).subscribe());

      this.getVaultCertificates(10);
  }

  getVaultCertificates(limit?: number, cursor?: string) {
    this._vaultsService.getVaultCertificates(limit, cursor)
      .pipe(take(1))
      .subscribe(certificates => this.certificates = certificates)
  }

  handlePageChange(cursor: string) {
    this.getVaultCertificates(null, cursor);
  }

  statCardTrackBy(index: number, statCard: StatCardInfo) {
    return `${index}-${statCard.title}-${statCard.value}`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
