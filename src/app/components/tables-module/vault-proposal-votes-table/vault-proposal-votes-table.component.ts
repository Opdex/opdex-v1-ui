import { VaultProposalVotes } from '@sharedModels/ui/vaults/vault-proposal-votes';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { IVaultProposalVoteResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-vote-response-model.interface';
import { Component, Input, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VaultProposalVotesFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposal-votes-filter';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { IVaultProposalVotesResponseModel } from '@sharedModels/platform-api/responses/vaults/vault-proposal-votes-response-model.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap, take } from 'rxjs/operators';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { TransactionView } from '@sharedModels/transaction-view';

@Component({
  selector: 'opdex-vault-proposal-votes-table',
  templateUrl: './vault-proposal-votes-table.component.html',
  styleUrls: ['./vault-proposal-votes-table.component.scss']
})
export class VaultProposalVotesTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: VaultProposalVotesFilter;
  @Input() hideProposalIdColumn: boolean;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  paging: ICursor;
  token$: Observable<IVaultProposalVotesResponseModel>;
  subscription: Subscription;
  icons = Icons;
  iconSizes = IconSizes;
  loading = true;

  constructor(
    private _vaultsService: VaultsService,
    private _indexService: IndexService,
    private _sidebar: SidenavService
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['voter', 'vote', 'balance', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.loading = true;
      this.subscription = new Subscription();
      this.subscription.add(
        this._indexService.getLatestBlock$()
          .pipe(switchMap(_ => this.getVotes$(this.filter?.cursor)))
          .subscribe(_ => this.loading = false))
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
        }),
        take(1));
  }

  pageChange(cursor: string): void {
    this.getVotes$(cursor).pipe(take(1)).subscribe();
  }

  trackBy(index: number, vote: IVaultProposalVoteResponseModel): string {
    return `${index}-${vote.voter}-${vote.vote}-${vote.balance}`;
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
