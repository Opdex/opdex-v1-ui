import { IVaultProposalsFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposals-filter';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Icons } from 'src/app/enums/icons';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { IVaultProposalResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-response-model.interface';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { Component, OnInit } from '@angular/core';
import { IVaultGovernanceResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-governance-response-model.interface';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultGovernancesService } from '@sharedServices/platform/vault-governances.service';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { VaultGovernanceStatCardsLookup } from '@sharedLookups/vault-governance-stat-cards.lookup';
import { StatCardInfo } from '@sharedModels/stat-card-info';
import { IVaultProposalsResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposals-response-model.interface';
import { VaultProposalsFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposals-filter';
import { TransactionView } from '@sharedModels/transaction-view';
import { ITransactionsRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { ReviewQuoteComponent } from '@sharedComponents/tx-module/shared/review-quote/review-quote.component';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { VaultCertificatesFilter, IVaultCertificatesFilter, VaultCertificateStatusFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-certificates-filter';
import { IVaultCertificates } from '@sharedModels/platform-api/responses/vaults/vault-certificate.interface';

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
  transactionsRequest: ITransactionsRequest;
  transactionViews = TransactionView;
  icons = Icons;
  context: any;
  proposalsFilter: VaultProposalsFilter;
  certificatesFilter: VaultCertificatesFilter;
  certificates: IVaultCertificates;

  constructor(
    private _vaultsService: VaultGovernancesService,
    private _tokensService: TokensService,
    private _blocksService: BlocksService,
    private _env: EnvironmentsService,
    private _sidebar: SidenavService,
    private _platformApiService: PlatformApiService,
    private _bottomSheet: MatBottomSheet,
    private _context: UserContextService
  ) {
    // Init with null to get default/loading animations
    this.statCards = VaultGovernanceStatCardsLookup.getStatCards(null, null);
    this.proposals = { results: [null, null, null, null], paging: {} } as IVaultProposalsResponseModel;

    this.proposalsFilter = new VaultProposalsFilter({
      limit: 4,
      direction: 'DESC'
    } as IVaultProposalsFilter);

    this.certificatesFilter = new VaultCertificatesFilter({
      status: VaultCertificateStatusFilter.vesting,
      limit: 10,
      direction: 'DESC'
    } as IVaultCertificatesFilter);

    this.subscription.add(this._context.getUserContext$().subscribe(context => this.context = context));

    this.transactionsRequest = {
      limit: 15,
      direction: "DESC",
      contracts: [this._env.vaultGovernanceAddress]
    };
  }

  ngOnInit(): void {
    this.subscription.add(
      this._blocksService.getLatestBlock$()
        .pipe(
          tap(block => this.latestBlock = block),
          switchMap(_ => this.getVault$()),
          switchMap(_ => this.getOpenProposals$()),
          switchMap(_ => this.getVaultCertificates$()))
        .subscribe());
  }

  getOpenProposals$(): Observable<IVaultProposalsResponseModel> {
    return this._vaultsService
      .getProposals(this.proposalsFilter, this._env.vaultGovernanceAddress)
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

  getVaultCertificates$(): Observable<IVaultCertificates> {
    return this._vaultsService.getCertificates(this.certificatesFilter, this._env.vaultGovernanceAddress)
      .pipe(tap(response => this.certificates = response));
  }

  handlePageChange($event) {
    this.certificatesFilter.cursor = $event;
    this.getVaultCertificates$().pipe(take(1)).subscribe();
  }

  openTransactionView(view: string) {
    this._sidebar.openSidenav(TransactionView.vaultProposal, { child: view });
  }

  proposalsPageChange(cursor: string) {
    this.proposalsFilter.cursor = cursor;
    this.getOpenProposals$().pipe(take(1)).subscribe();
  }

  proposalsTrackBy(index: number, proposal: IVaultProposalResponseModel) {
    if (proposal === null || proposal === undefined) return index;
    return `${index}-${proposal.proposalId}-${proposal.status}-${proposal.expiration}-${proposal.pledgeAmount}-${proposal.yesAmount}-${proposal.noAmount}`;
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
