import { TokensService } from '@sharedServices/platform/tokens.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
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

  constructor(
    private _vaultsService: VaultsService,
    private _tokensService: TokensService,
    private _platformApi: PlatformApiService,
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
        tap(token => this.vault.lockedToken = token))
      .subscribe());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
