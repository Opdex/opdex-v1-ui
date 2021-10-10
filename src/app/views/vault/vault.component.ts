import { environment } from '@environments/environment';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { StatCardInfo } from '@sharedComponents/cards-module/stat-card/stat-card-info';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultsService } from './../../services/platform/vaults.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { tap, switchMap, take } from 'rxjs/operators';
import { IVault } from '@sharedModels/platform-api/responses/vaults/vault.interface';
import { IVaultCertificate, IVaultCertificates } from '@sharedModels/platform-api/responses/vaults/vault-certificate.interface';

@Component({
  selector: 'opdex-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  vault: IVault;
  certificates: IVaultCertificates;
  statCards: StatCardInfo[] = [
    {
      title: 'Locked Tokens',
      value: '0',
      suffix: 'XYZ',
      helpInfo: {
        title: 'Locked Tokens',
        paragraph: 'THe locked tokens indicator displays how many governance tokens are currently locked within the vault contract. As certificates are redeemed and tokens are collected, the supply will be reduced accordingly.'
      },
      show: true
    },
    {
      title: 'Unassigned Tokens',
      value: '0',
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
    private _platformApi: PlatformApiService
  ) { }

  ngOnInit(): void {
    this.subscription.add(interval(30000)
      .pipe(tap(_ => {
        this._vaultsService.refreshVault();
      }))
      .subscribe());

    this.subscription.add(this._vaultsService.getVault()
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
        }))
      .subscribe());

      this.getVaultCertificates(10);
  }

  getVaultCertificates(limit?: number, cursor?: string) {
    this._platformApi.getVaultCertificates(environment.vaultAddress, limit, cursor)
      .pipe(take(1))
      .subscribe(certificates => this.certificates = certificates)
  }

  handlePageChange(cursor: string) {
    this.getVaultCertificates(null, cursor);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
