import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { Component, OnInit } from '@angular/core';
import { IVaultGovernanceResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-governance-response-model.interface';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultGovernancesService } from '@sharedServices/platform/vault-governances.service';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { VaultGovernanceStatCardsLookup } from '@sharedLookups/vault-governance-stat-cards.lookup';
import { StatCardInfo } from '@sharedModels/stat-card-info';

@Component({
  selector: 'opdex-vault-governance',
  templateUrl: './vault-governance.component.html',
  styleUrls: ['./vault-governance.component.scss']
})
export class VaultGovernanceComponent implements OnInit {
  subscription: Subscription = new Subscription();
  vault: IVaultGovernanceResponseModel;
  token: IToken;
  statCards: StatCardInfo[];

  constructor(
    private _vaultsService: VaultGovernancesService,
    private _tokensService: TokensService,
    private _blocksService: BlocksService
  ) {
    // Init with null to get default/loading animations
    this.statCards = VaultGovernanceStatCardsLookup.getStatCards(null, null);
  }

  ngOnInit(): void {
    this.subscription.add(
      this._blocksService.getLatestBlock$()
        .pipe(switchMap(_ => this.getVault$()))
        .subscribe());
  }

  getVault$(): Observable<IToken> {
    return this._vaultsService.getVault()
      .pipe(
        tap(vault => this.vault = vault),
        switchMap(_ => this._tokensService.getToken(this.vault.token)),
        map(token => {
          this.token = token as IToken;
          this.statCards = VaultGovernanceStatCardsLookup.getStatCards(this.vault, this.token);
          return this.token;
        }));
  }

  statCardTrackBy(index: number, statCard: StatCardInfo) {
    return `${index}-${statCard.title}-${statCard.value}`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
