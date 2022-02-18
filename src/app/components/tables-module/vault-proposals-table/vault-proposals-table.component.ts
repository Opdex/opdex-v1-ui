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

@Component({
  selector: 'opdex-vault-proposals-table',
  templateUrl: './vault-proposals-table.component.html',
  styleUrls: ['./vault-proposals-table.component.scss']
})
export class VaultProposalsTableComponent  implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: VaultProposalsFilter;
  latestBlock: number;
  displayedColumns: string[];
  dataSource: MatTableDataSource<VaultProposal>;
  paging: ICursor;
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
    this.displayedColumns = ['proposalId', 'type', 'proposed', 'status', 'progress', 'expiration', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.loading = true;
      this.subscription = new Subscription();
      this.subscription.add(
        this._indexService.getLatestBlock$()
          .pipe(
            tap(block => this.latestBlock = block.height),
            switchMap(_ => this.getProposals$(this.filter?.cursor)))
          .subscribe(_ => this.loading = false));
    }
  }

  openSidebar(childView: string, proposalId: number, withdraw: boolean): void {
    this._sidebar.openSidenav(TransactionView.vaultProposal, { child: childView, proposalId, withdraw })
  }

  private getProposals$(cursor?: string): Observable<VaultProposals> {
    this.filter.cursor = cursor;

    return this._vaultsService.getProposals(this.filter)
      .pipe(
        tap((proposals: VaultProposals) => {
          this.paging = proposals.paging;
          this.dataSource.data = proposals.results;
        }),
        take(1));
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
