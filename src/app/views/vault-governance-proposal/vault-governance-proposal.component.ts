import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { catchError } from 'rxjs/operators';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { VaultProposalPledgesFilter, IVaultProposalPledgesFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-pledges-filter';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IVaultGovernanceResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-governance-response-model.interface';
import { IVaultProposalResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-response-model.interface';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultGovernancesService } from '@sharedServices/platform/vault-governances.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Observable, of, Subscription } from 'rxjs';
import { tap, switchMap, map, take } from 'rxjs/operators';
import { ReviewQuoteComponent } from '@sharedComponents/tx-module/shared/review-quote/review-quote.component';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { StatCardInfo } from '@sharedModels/stat-card-info';
import { TransactionView } from '@sharedModels/transaction-view';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { IVaultProposalVotesFilter, VaultProposalVotesFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-votes-filter';
import { IVaultProposalVoteResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-vote-response-model.interface';
import { IVaultProposalPledgeResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-pledge-response-model.interface';

@Component({
  selector: 'opdex-vault-governance-proposal',
  templateUrl: './vault-governance-proposal.component.html',
  styleUrls: ['./vault-governance-proposal.component.scss']
})
export class VaultGovernanceProposalComponent {
  subscription: Subscription = new Subscription();
  vault: IVaultGovernanceResponseModel;
  token: IToken;
  latestBlock: IBlock;
  pledgesFilter: VaultProposalPledgesFilter;
  votesFilter: VaultProposalVotesFilter;
  proposal: IVaultProposalResponseModel;
  context: any;
  userVote: IVaultProposalVoteResponseModel;
  userPledge: IVaultProposalPledgeResponseModel;
  icons = Icons;
  iconSizes = IconSizes;

  constructor(
    private _vaultsService: VaultGovernancesService,
    private _tokensService: TokensService,
    private _blocksService: BlocksService,
    private _sidebar: SidenavService,
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService,
    private _bottomSheet: MatBottomSheet,
    private _context: UserContextService
  ) {
    const proposalId = parseInt(this._route.snapshot.paramMap.get('proposalId'));

    this.subscription.add(this._context.getUserContext$().subscribe(context => this.context = context));

    this.subscription.add(
      this._blocksService.getLatestBlock$()
        .pipe(
          tap(block => this.latestBlock = block),
          switchMap(_ => this.getVault$()),
          switchMap(_ => this.getProposal$(proposalId)),
          switchMap(_ => this.getVote$()),
          switchMap(_ => this.getPledge$()))
        .subscribe());

    this.pledgesFilter = new VaultProposalPledgesFilter({
      proposalId: proposalId,
      limit: 5,
      direction: 'DESC',
      includeZeroBalances: true
    } as IVaultProposalPledgesFilter);

    this.votesFilter = new VaultProposalVotesFilter({
      proposalId: proposalId,
      limit: 5,
      direction: 'DESC',
      includeZeroBalances: true
    } as IVaultProposalVotesFilter);
  }

  getProposal$(proposalId: number): Observable<IVaultProposalResponseModel> {
    return this._vaultsService
      .getProposal(proposalId)
      .pipe(tap(proposal => this.proposal = proposal));
  }

  getVault$(): Observable<IToken> {
    return this._vaultsService.getVault()
      .pipe(
        tap(vault => this.vault = vault),
        switchMap(_ => this._tokensService.getToken(this.vault.token)),
        map(token => {
          this.token = token as IToken;
          return this.token;
        }));
  }

  getVote$(): Observable<IVaultProposalVoteResponseModel> {
    if (this.proposal.status === 'Pledge' || !!this.context?.wallet === false) return of(null);

    return this._vaultsService.getVote(this.proposal.proposalId, this.context.wallet, this.proposal.vault)
      .pipe(
        catchError(_ => of(null)),
        tap(vote => this.userVote = vote));
  }

  getPledge$(): Observable<IVaultProposalVoteResponseModel> {
    if (!!this.context?.wallet === false) return of(null);

    return this._vaultsService.getPledge(this.proposal.proposalId, this.context.wallet, this.proposal.vault)
      .pipe(
        catchError(_ => of(null)),
        tap(pledge => this.userPledge = pledge));
  }

  openTransactionView(view: string, withdraw: boolean) {
    this._sidebar.openSidenav(TransactionView.vaultProposal, { child: view, withdraw, proposalId: this.proposal.proposalId });
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
    const duration = proposal.status === 'Pledge' ? oneWeek : threeDays;
    const startBlock = proposal.expiration - duration;
    const blocksPassed = this.latestBlock.height - startBlock;

    return Math.floor((blocksPassed / duration) * 100);
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

  quoteComplete(proposalId: number): void {
    this._platformApiService
      .completeVaultProposal(this.vault.vault, proposalId)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this._bottomSheet.open(ReviewQuoteComponent, { data: quote }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
