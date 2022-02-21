import { VaultCertificates } from '@sharedModels/ui/vaults/vault-certificates';
import { Vault } from '@sharedModels/ui/vaults/vault';
import { Token } from '@sharedModels/ui/tokens/token';
import { IVaultProposalsFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposals-filter';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Icons } from 'src/app/enums/icons';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IndexService } from '@sharedServices/platform/index.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { VaultStatCardsLookup } from '@sharedLookups/vault-stat-cards.lookup';
import { StatCardInfo } from '@sharedModels/stat-card-info';
import { VaultProposalsFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposals-filter';
import { TransactionView } from '@sharedModels/transaction-view';
import { ITransactionsRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { VaultCertificatesFilter, IVaultCertificatesFilter } from '@sharedModels/platform-api/requests/vaults/vault-certificates-filter';
import { UserContext } from '@sharedModels/user-context';
import { VaultCertificate } from '@sharedModels/ui/vaults/vault-certificate';

@Component({
  selector: 'opdex-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {
  @ViewChild('proposalScrollBar') proposalScrollBar: ElementRef;

  subscription: Subscription = new Subscription();
  vault: Vault;
  token: Token;
  latestBlock: IBlock;
  statCards: StatCardInfo[];
  transactionsRequest: ITransactionsRequest;
  transactionViews = TransactionView;
  icons = Icons;
  context: UserContext;
  proposalsFilter: VaultProposalsFilter;
  certificatesFilter: VaultCertificatesFilter;
  certificates: VaultCertificates;

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
    this.certificates = { results: [null, null, null, null], paging: {} } as VaultCertificates;

    this.proposalsFilter = new VaultProposalsFilter({
      limit: 5,
      direction: 'DESC'
    } as IVaultProposalsFilter);

    this.certificatesFilter = new VaultCertificatesFilter({
      limit: 12,
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
          switchMap(_ => this.getVaultCertificates$()))
        .subscribe());
  }

  getVault$(): Observable<Token> {
    return this._vaultsService.getVault()
      .pipe(
        tap(vault => this.vault = vault),
        switchMap(_ => this._tokensService.getToken(this.vault.token)),
        map(token => {
          this.token = token;
          this.statCards = VaultStatCardsLookup.getStatCards(this.vault, this.token);
          return this.token;
        }));
  }

  getVaultCertificates$(): Observable<VaultCertificates> {
    return this._vaultsService.getCertificates(this.certificatesFilter, this._env.vaultAddress)
      .pipe(tap(response => this.certificates = response));
  }

  handlePageChange($event): void {
    this.certificatesFilter.cursor = $event;
    this.getVaultCertificates$().pipe(take(1)).subscribe();
  }

  openTransactionView(view: string): void {
    this._sidebar.openSidenav(TransactionView.vaultProposal, { child: view });
  }

  certificatesPageChange(cursor: string): void {
    this.certificatesFilter.cursor = cursor;
    this.certificates = { results: [null, null, null, null], paging: {} } as VaultCertificates;
    this.getVaultCertificates$().pipe(take(1)).subscribe();
  }

  certificatesTrackBy(index: number, certificate: VaultCertificate): string {
    return `${index}-${certificate?.trackBy}`;
  }

  statCardTrackBy(index: number, statCard: StatCardInfo): string {
    return `${index}-${statCard?.title}-${statCard?.value?.formattedValue}`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
