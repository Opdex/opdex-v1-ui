import { SidenavService } from './../../../services/utility/sidenav.service';
import { OnDestroy } from '@angular/core';
import { VaultProposalPledgesFilter } from '@sharedModels/platform-api/requests/vault-governances/vault-proposal-pledges-filter';
import { IVaultProposalPledgesResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-pledges-response-model.interface';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { VaultGovernancesService } from '@sharedServices/platform/vault-governances.service';
import { IVaultProposalPledgeResponseModel } from '@sharedModels/platform-api/responses/vault-governances/vault-proposal-pledge-response-model.interface';
import { TransactionView } from '@sharedModels/transaction-view';

@Component({
  selector: 'opdex-vault-proposal-pledges-table',
  templateUrl: './vault-proposal-pledges-table.component.html',
  styleUrls: ['./vault-proposal-pledges-table.component.scss']
})
export class VaultProposalPledgesTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: VaultProposalPledgesFilter;
  @Input() hideProposalIdColumn: boolean;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  paging: ICursor;
  token$: Observable<IVaultProposalPledgesResponseModel>;
  subscription: Subscription;
  icons = Icons;
  iconSizes = IconSizes;
  loading = true;

  constructor(
    private _vaultsService: VaultGovernancesService,
    private _indexService: IndexService,
    private _sidebar: SidenavService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['pledger', 'pledge', 'balance', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.loading = true;
      this.subscription = new Subscription();
      this.subscription.add(
        this._indexService.getLatestBlock$()
          .pipe(switchMap(_ => this.getPledges$(this.filter?.cursor)))
          .subscribe(_ => this.loading = false))
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

  private getPledges$(cursor?: string): Observable<IVaultProposalPledgesResponseModel> {
    this.filter.cursor = cursor;

    return this._vaultsService.getPledges(this.filter)
      .pipe(
        tap((pledges: IVaultProposalPledgesResponseModel) => {
          this.paging = pledges.paging;
          this.dataSource.data = pledges.results;
        }),
        take(1));
  }

  pageChange(cursor: string) {
    this.getPledges$(cursor).pipe(take(1)).subscribe();
  }

  trackBy(index: number, pledge: IVaultProposalPledgeResponseModel) {
    return `${index}-${pledge.pledger}-${pledge.pledge}-${pledge.balance}`;
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
