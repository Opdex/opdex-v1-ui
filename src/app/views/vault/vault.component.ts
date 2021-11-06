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
  statCards: StatCardInfo[] = [
    {
      title: 'Locked',
      value: null,
      suffix: 'XYZ',
      helpInfo: {
        title: 'Locked Tokens',
        paragraph: 'The locked tokens indicator displays how many governance tokens are currently locked within the vault contract. As certificates are redeemed and tokens are collected, the supply will be reduced accordingly.'
      },
      show: true
    },
    {
      title: 'Unassigned',
      value: null,
      suffix: 'XYZ',
      helpInfo: {
        title: 'Unassigned Tokens',
        paragraph: 'Unassigned tokens is the balance of tokens not currently assigned to active certificates. As certificates are created and assigned to wallets, the amount of unassigned tokens is reduced accordingly.'
      },
      show: true
    }
  ];

  constructor(
    private _vaultsService: VaultsService,
    private _tokensService: TokensService,
    private _blocksService: BlocksService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this._blocksService.getLatestBlock$().pipe(switchMap(_ => this._vaultsService.getVault()
        .pipe(
          tap(vault => this.vault = vault),
          switchMap(() => this._tokensService.getToken(this.vault.lockedToken?.address || this.vault.lockedToken)),
          tap(token => this.vault.lockedToken = token),
          tap(_ => {
            const vaultTokenSymbol = this.vault.lockedToken.symbol;

            this.statCards[0].value = this.vault.tokensLocked;
            this.statCards[0].suffix = vaultTokenSymbol;

            this.statCards[1].value = this.vault.tokensUnassigned;
            this.statCards[1].suffix = vaultTokenSymbol;
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
