import { VaultProposalVotes } from '@sharedModels/ui/vaults/vault-proposal-votes';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Component, Input, ViewChild, OnChanges, OnDestroy, EventEmitter, Output } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VaultProposalVotesFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposal-votes-filter';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap, take } from 'rxjs/operators';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { TransactionView } from '@sharedModels/transaction-view';
import { VaultProposalVote } from '@sharedModels/ui/vaults/vault-proposal-vote';
import { UserContext } from '@sharedModels/user-context';
import { UserContextService } from '@sharedServices/utility/user-context.service';

@Component({
  selector: 'opdex-vault-proposal-votes-table',
  templateUrl: './vault-proposal-votes-table.component.html',
  styleUrls: ['./vault-proposal-votes-table.component.scss']
})
export class VaultProposalVotesTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: VaultProposalVotesFilter;
  @Input() hideProposalIdColumn: boolean;
  @Output() onNumRecordsCount = new EventEmitter<string>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  paging: ICursor;
  token$: Observable<VaultProposalVote>;
  subscription: Subscription;
  context: UserContext;
  icons = Icons;
  iconSizes = IconSizes;
  loading = true;

  constructor(
    private _vaultsService: VaultsService,
    private _indexService: IndexService,
    private _sidebar: SidenavService,
    private _userContext: UserContextService
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['voter', 'vote', 'balance', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.loading = true;
      this.subscription = new Subscription();
      this.subscription.add(
        this._indexService.latestBlock$
          .pipe(switchMap(_ => this.getVotes$(this.filter?.cursor)))
          .subscribe(_ => this.loading = false));

      this.subscription.add(
        this._userContext.getUserContext$()
          .subscribe(context => this.context = context));
    }

    if (!!this.hideProposalIdColumn === false) this.displayedColumns.unshift('proposalId')
    else {
      const index = this.displayedColumns.findIndex(item => item === 'proposalId');
      if (index > -1) this.displayedColumns = this.displayedColumns.splice(index, 1);
    }
  }

  openSidebar(proposalId: number, withdraw: boolean): void {
    this._sidebar.openSidenav(TransactionView.vaultProposal, { child: 'Vote', proposalId, withdraw })
  }

  private getVotes$(cursor?: string): Observable<VaultProposalVotes> {
    this.filter.cursor = cursor;

    return this._vaultsService.getVotes(this.filter)
      .pipe(
        tap((votes: VaultProposalVotes) => {
          this.paging = votes.paging;
          this.dataSource.data = votes.results;
          this.onNumRecordsCount.emit(this._numRecords(votes.paging, votes.results));
        }),
        take(1));
  }

  private _numRecords(paging: ICursor, records: VaultProposalVote[]): string {
    return paging.next || paging.previous
      ? `${this.filter.limit}+`
      : records.length.toString();
  }

  pageChange(cursor: string): void {
    this.getVotes$(cursor).pipe(take(1)).subscribe();
  }

  trackBy(index: number, vote: VaultProposalVote): string {
    return `${index}-${vote?.trackBy}`;
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
