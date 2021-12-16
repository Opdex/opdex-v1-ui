import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { MathService } from '@sharedServices/utility/math.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IVaultProposalResponseModel } from './../../models/platform-api/responses/vault-governances/vault-proposal-response-model.interface';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
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
import { IVaultProposalsResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposals-response-model.interface';
import { VaultProposalsFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposals-filter';
import { TransactionView } from '@sharedModels/transaction-view';

@Component({
  selector: 'opdex-vault-governance',
  templateUrl: './vault-governance.component.html',
  styleUrls: ['./vault-governance.component.scss']
})
export class VaultGovernanceComponent implements OnInit {
  subscription: Subscription = new Subscription();
  vault: IVaultGovernanceResponseModel;
  token: IToken;
  latestBlock: IBlock;
  statCards: StatCardInfo[];
  proposals: IVaultProposalsResponseModel;
  transactionViews = TransactionView;

  constructor(
    private _vaultsService: VaultGovernancesService,
    private _tokensService: TokensService,
    private _blocksService: BlocksService,
    private _env: EnvironmentsService,
    private _sidebar: SidenavService
  ) {
    // Init with null to get default/loading animations
    this.statCards = VaultGovernanceStatCardsLookup.getStatCards(null, null);
  }

  ngOnInit(): void {
    this.subscription.add(
      this._blocksService.getLatestBlock$()
        .pipe(
          tap(block => this.latestBlock = block),
          switchMap(_ => this.getVault$()))
        .subscribe());

    this.subscription.add(
      this._blocksService.getLatestBlock$()
        .pipe(switchMap(_ => this.getOpenProposals$()))
        .subscribe());
  }

  getOpenProposals$(): Observable<IVaultProposalsResponseModel> {
    return this._vaultsService
      .getProposals(new VaultProposalsFilter(), this._env.vaultGovernanceAddress)
      .pipe(tap(proposals => this.proposals = proposals));
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

  openTransactionView(view: string) {
    this._sidebar.openSidenav(TransactionView.vaultProposal, { child: view });
  }

  proposalsTrackBy(index: number, proposal: IVaultProposalResponseModel) {
    if (proposal === null || proposal === undefined) return index;
    return `${index}-${proposal.proposalId}-${proposal.status}-${proposal.expiration}-${proposal.pledgeAmount}-${proposal.yesAmount}-${proposal.noAmount}`;
  }

  getPledgePercentage(proposal: IVaultProposalResponseModel) {
    const minimum = new FixedDecimal(this.vault.totalPledgeMinimum, 8);
    const pledge = new FixedDecimal(proposal.pledgeAmount, 8);

    return MathService.multiply(new FixedDecimal(MathService.divide(pledge, minimum), 8), new FixedDecimal('100', 0));
  }

  getExpirationPercentage(proposal: IVaultProposalResponseModel) {
    if (proposal.status === 'Complete' || proposal.expiration <= this.latestBlock.height) return 100;

    const threeDays = 60 * 60 * 24 * 3 / 16;
    const oneWeek = 60 * 60 * 24 * 7 / 16;

    if (proposal.status === 'Pledge') {
      const startBlock = proposal.expiration - oneWeek;
      const blocksPassed = this.latestBlock.height - startBlock;
      return Math.floor((blocksPassed / oneWeek) * 100);
    }

    const startBlock = proposal.expiration - threeDays;
    const blocksPassed = this.latestBlock.height - startBlock;
    return Math.floor((blocksPassed / threeDays) * 100);
  }

  getVotePercentage(valueOne: string, valueTwo: string) {
    const first = new FixedDecimal(valueOne, 8);
    const second = new FixedDecimal(valueTwo, 8);

    if (second.bigInt === BigInt(0) && first.bigInt > BigInt(0)) return 100;
    else if (second.bigInt === BigInt(0) && first.bigInt == BigInt(0)) return 0;

    return MathService.multiply(new FixedDecimal(MathService.divide(first, second), 8), new FixedDecimal('100', 0));
  }

  statCardTrackBy(index: number, statCard: StatCardInfo) {
    return `${index}-${statCard.title}-${statCard.value}`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
