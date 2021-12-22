import { IVaultProposalVoteResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-vote-response-model.interface';
import { Component, Input, ViewChild, OnChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VaultProposalVotesFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-votes-filter';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { IVaultProposalVotesResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-votes-response-model.interface';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { VaultGovernancesService } from '@sharedServices/platform/vault-governances.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap, tap, take } from 'rxjs/operators';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-vault-proposal-votes-table',
  templateUrl: './vault-proposal-votes-table.component.html',
  styleUrls: ['./vault-proposal-votes-table.component.scss']
})
export class VaultProposalVotesTableComponent implements OnChanges {
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

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _vaultsService: VaultGovernancesService, private _blocksService: BlocksService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['voter', 'vote', 'balance', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.loading = true;
      this.subscription = new Subscription();
      this.subscription.add(
        this._blocksService.getLatestBlock$()
          .pipe(switchMap(_ => this.getVotes$(this.filter?.cursor)))
          .subscribe(_ => this.loading = false))
    }

    if (!!this.hideProposalIdColumn === false) this.displayedColumns.unshift('proposalId')
    else {
      const index = this.displayedColumns.findIndex(item => item === 'proposalId');
      if (index > -1) this.displayedColumns = this.displayedColumns.splice(index, 1);
    }
  }

  private getVotes$(cursor?: string): Observable<IVaultProposalVotesResponseModel> {
    this.filter.cursor = cursor;

    return this._vaultsService.getVotes(this.filter)
      .pipe(
        tap((votes: IVaultProposalVotesResponseModel) => {
          this.paging = votes.paging;
          this.dataSource.data = votes.results;
        }),
        take(1));
  }

  pageChange(cursor: string) {
    this.getVotes$(cursor).pipe(take(1)).subscribe();
  }

  trackBy(index: number, vote: IVaultProposalVoteResponseModel) {
    return `${index}-${vote.voter}-${vote.vote}-${vote.balance}`;
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
