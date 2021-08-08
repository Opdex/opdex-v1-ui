import { environment } from '@environments/environment';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { StatCardInfo } from '@sharedComponents/cards-module/stat-card/stat-card-info';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultsService } from './../../services/platform/vaults.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { IVaultCertificate } from '@sharedModels/responses/platform-api/Vaults/vault.interface';
@Component({
  selector: 'opdex-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  vault: any;
  certificates: IVaultCertificate[];
  statCards: StatCardInfo[] = [
    {
      title: 'Locked Tokens',
      value: '0',
      formatNumber: 0,
      suffix: 'XYZ',
      helpInfo: {
        title: 'Locked Tokens Help',
        paragraph: 'This modal is providing help for Locked Tokens.'
      },
      show: true
    },
    {
      title: 'Unassigned Tokens',
      value: '0',
      formatNumber: 0,
      suffix: 'XYZ',
      helpInfo: {
        title: 'Unassigned Tokens Help',
        paragraph: 'This modal is providing help for Unassigned Tokens.'
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

      this.subscription.add(
        this._platformApi.getVaultCertificates(environment.vaultAddress)
          .subscribe(certificates => this.certificates = certificates.results));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
