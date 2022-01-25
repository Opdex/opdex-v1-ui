import { IVaultProposalsFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposals-filter';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Icons } from 'src/app/enums/icons';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { IVaultProposalResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-response-model.interface';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IVaultResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-response-model.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { VaultStatCardsLookup } from '@sharedLookups/vault-stat-cards.lookup';
import { StatCardInfo } from '@sharedModels/stat-card-info';
import { IVaultProposalsResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposals-response-model.interface';
import { VaultProposalsFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposals-filter';
import { TransactionView } from '@sharedModels/transaction-view';
import { ITransactionsRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { VaultCertificatesFilter, IVaultCertificatesFilter, VaultCertificateStatusFilter } from '@sharedModels/platform-api/requests/vaults/vault-certificates-filter';
import { IVaultCertificates } from '@sharedModels/platform-api/responses/vaults/vault-certificate.interface';
import { UserContext } from '@sharedModels/user-context';

@Component({
  selector: 'opdex-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {
  @ViewChild('proposalScrollBar') proposalScrollBar: ElementRef;

  subscription: Subscription = new Subscription();
  vault: IVaultResponseModel;
  token: IToken;
  latestBlock: IBlock;
  statCards: StatCardInfo[];
  proposals: IVaultProposalsResponseModel;
  transactionsRequest: ITransactionsRequest;
  transactionViews = TransactionView;
  icons = Icons;
  context: UserContext;
  proposalsFilter: VaultProposalsFilter;
  certificatesFilter: VaultCertificatesFilter;
  certificates: IVaultCertificates;

  constructor(
    private _vaultsService: VaultsService,
    private _tokensService: TokensService,
    private _indexService: IndexService,
    private _env: EnvironmentsService,
    private _sidebar: SidenavService,
    private _context: UserContextService
  ) {
    // Init with null to get default/loading animations
    this.statCards = VaultStatCardsLookup.getStatCards(null, null);
    this.proposals = { results: [null, null, null, null], paging: {} } as IVaultProposalsResponseModel;

    this.proposalsFilter = new VaultProposalsFilter({
      limit: 4,
      direction: 'DESC'
    } as IVaultProposalsFilter);

    this.certificatesFilter = new VaultCertificatesFilter({
      status: [VaultCertificateStatusFilter.vesting],
      limit: 10,
      direction: 'DESC'
    } as IVaultCertificatesFilter);

    this.subscription.add(this._context.getUserContext$().subscribe(context => this.context = context));

    this.transactionsRequest = {
      limit: 15,
      direction: "DESC",
      contracts: [this._env.vaultAddress]
    };
  }

  ngOnInit(): void {
    this.subscription.add(
      this._indexService.getLatestBlock$()
        .pipe(
          tap(block => this.latestBlock = block),
          switchMap(_ => this.getVault$()),
          switchMap(_ => this.getOpenProposals$()),
          switchMap(_ => this.getVaultCertificates$()))
        .subscribe());
  }

  getOpenProposals$(): Observable<IVaultProposalsResponseModel> {
    return this._vaultsService
      .getProposals(this.proposalsFilter, this._env.vaultAddress)
      .pipe(tap(proposals => this.proposals = proposals));
  }

  getVault$(): Observable<IToken> {
    return this._vaultsService.getVault()
      .pipe(
        tap(vault => this.vault = vault),
        switchMap(_ => this._tokensService.getToken(this.vault.token)),
        map(token => {
          this.token = token as IToken;
          this.statCards = VaultStatCardsLookup.getStatCards(this.vault, this.token);
          return this.token;
        }));
  }

  getVaultCertificates$(): Observable<IVaultCertificates> {
    return this._vaultsService.getCertificates(this.certificatesFilter, this._env.vaultAddress)
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
    this.proposals = { results: [null, null, null, null], paging: {} } as IVaultProposalsResponseModel;
    this.proposalScrollBar.nativeElement.scrollTo({left: 0, behavior: 'smooth'});
    this.getOpenProposals$().pipe(take(1)).subscribe();
  }

  proposalsTrackBy(index: number, proposal: IVaultProposalResponseModel) {
    if (proposal === null || proposal === undefined) return index;
    return `${index}-${proposal.proposalId}-${proposal.status}-${proposal.expiration}-${proposal.pledgeAmount}-${proposal.yesAmount}-${proposal.noAmount}`;
  }

  statCardTrackBy(index: number, statCard: StatCardInfo) {
    return `${index}-${statCard.title}-${statCard.value}`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
