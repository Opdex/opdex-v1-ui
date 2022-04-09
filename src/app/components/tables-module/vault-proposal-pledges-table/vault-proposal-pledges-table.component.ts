import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { EventEmitter, OnDestroy, Output } from '@angular/core';
import { VaultProposalPledgesFilter } from '@sharedModels/platform-api/requests/vaults/vault-proposal-pledges-filter';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { VaultsService } from '@sharedServices/platform/vaults.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { VaultProposalPledges } from '@sharedModels/ui/vaults/vault-proposal-pledges';
import { VaultProposalPledge } from '@sharedModels/ui/vaults/vault-proposal-pledge';
import { UserContext } from '@sharedModels/user-context';
import { UserContextService } from '@sharedServices/utility/user-context.service';

@Component({
  selector: 'opdex-vault-proposal-pledges-table',
  templateUrl: './vault-proposal-pledges-table.component.html',
  styleUrls: ['./vault-proposal-pledges-table.component.scss']
})
export class VaultProposalPledgesTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: VaultProposalPledgesFilter;
  @Input() hideProposalIdColumn: boolean;
  @Output() onNumRecordsCount = new EventEmitter<string>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<VaultProposalPledge>;
  paging: ICursor;
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
    this.displayedColumns = ['pledger', 'pledge', 'balance', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.loading = true;
      this.subscription = new Subscription();
      this.subscription.add(
        this._indexService.latestBlock$
          .pipe(switchMap(_ => this.getPledges$(this.filter?.cursor)))
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
    this._sidebar.openSidenav(TransactionView.vaultProposal, { child: 'Pledge', proposalId, withdraw })
  }

  private getPledges$(cursor?: string): Observable<VaultProposalPledges> {
    this.filter.cursor = cursor;

    return this._vaultsService.getPledges(this.filter)
      .pipe(
        tap((pledges: VaultProposalPledges) => {
          this.paging = pledges.paging;
          this.dataSource.data = pledges.results;
          this.onNumRecordsCount.emit(this._numRecords(pledges.paging, pledges.results));
        }),
        take(1));
  }

  private _numRecords(paging: ICursor, records: VaultProposalPledge[]): string {
    return paging.next || paging.previous
      ? `${this.filter.limit}+`
      : records.length.toString();
  }

  pageChange(cursor: string): void {
    this.getPledges$(cursor).pipe(take(1)).subscribe();
  }

  trackBy(index: number, pledge: VaultProposalPledge): string {
    return `${index}-${pledge?.trackBy}`;
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
