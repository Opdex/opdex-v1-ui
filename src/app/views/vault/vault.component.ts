import { StatCardInfo } from '@sharedComponents/cards-module/stat-card/stat-card-info';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultsService } from './../../services/platform/vaults.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
@Component({
  selector: 'opdex-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  vault: any;
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
    private _tokensService: TokensService
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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
