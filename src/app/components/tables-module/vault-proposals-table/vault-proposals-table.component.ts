import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Vault } from '@sharedModels/ui/vaults/vault';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { UserContext } from '@sharedModels/user-context';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { VaultProposalsFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposals-filter';
import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { TransactionView } from '@sharedModels/transaction-view';
import { VaultProposals } from '@sharedModels/ui/vaults/vault-proposals';
import { IndexService } from '@sharedServices/platform/index.service';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap, take } from 'rxjs/operators';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { VaultProposal } from '@sharedModels/ui/vaults/vault-proposal';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { ReviewQuoteComponent } from '@sharedComponents/tx-module/shared/review-quote/review-quote.component';

@Component({
  selector: 'opdex-vault-proposals-table',
  templateUrl: './vault-proposals-table.component.html',
  styleUrls: ['./vault-proposals-table.component.scss']
})
export class VaultProposalsTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: VaultProposalsFilter;
  latestBlock: number;
  displayedColumns: string[];
  dataSource: MatTableDataSource<VaultProposal>;
  paging: ICursor;
  subscription: Subscription;
  context: UserContext;
  vault: Vault;
  icons = Icons;
  iconSizes = IconSizes;
  loading = true;
  oneHundred = FixedDecimal.OneHundred(0);

  constructor(
    private _vaultsService: VaultsService,
    private _indexService: IndexService,
    private _sidebar: SidenavService,
    private _userContext: UserContextService,
    private _env: EnvironmentsService,
    private _platformApiService: PlatformApiService,
    private _bottomSheet: MatBottomSheet
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['proposalId', 'type', 'proposed', 'status', 'minimums', 'progress', 'expiration', 'actions'];
  }

  private get _getVault$(): Observable<Vault> {
    return this._vaultsService.getVault(this._env.vaultAddress)
      .pipe(tap(vault => this.vault = vault));
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.loading = true;
      this.subscription = new Subscription();
      this.subscription.add(
        this._indexService.getLatestBlock$()
          .pipe(
            tap(block => this.latestBlock = block.height),
            switchMap(_ => this._getVault$),
            switchMap(_ => this.getProposals$(this.filter?.cursor)))
          .subscribe(_ => this.loading = false));

      this.subscription.add(
        this._userContext.getUserContext$()
          .subscribe(context => this.context = context));
    }
  }

  openSidebar(childView: string, proposalId: number, withdraw: boolean): void {
    this._sidebar.openSidenav(TransactionView.vaultProposal, { child: childView, proposalId, withdraw })
  }

  quoteCompleteProposal(proposalId: number): void {
    if (!this.context?.wallet) return;

    this._platformApiService
      .completeVaultProposal(this._env.vaultAddress, proposalId)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this._bottomSheet.open(ReviewQuoteComponent, { data: quote }));
  }

  private getProposals$(cursor?: string): Observable<VaultProposals> {
    this.filter.cursor = cursor;

    return this._vaultsService.getProposals(this.filter)
      .pipe(
        tap((proposals: VaultProposals) => {
          this.paging = proposals.paging;
          this.dataSource.data = proposals.results;
        }));
  }

  pageChange(cursor: string): void {
    this.getProposals$(cursor).pipe(take(1)).subscribe();
  }

  trackBy(index: number, proposal: VaultProposal): string {
    return `${index}-${proposal?.trackBy}`;
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
