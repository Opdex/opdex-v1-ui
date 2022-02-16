import { Component, Input, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { MatSort } from '@angular/material/sort';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { LiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { Observable, Subscription } from 'rxjs';
import { IndexService } from '@sharedServices/platform/index.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { LiquidityPools } from '@sharedModels/ui/liquidity-pools/liquidity-pools';

@Component({
  selector: 'opdex-pools-table',
  templateUrl: './pools-table.component.html',
  styleUrls: ['./pools-table.component.scss']
})
export class PoolsTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: LiquidityPoolsFilter;
  displayedColumns: string[];
  dataSource: MatTableDataSource<LiquidityPool>;
  subscription: Subscription;
  paging: ICursor;
  icons = Icons;
  iconSizes = IconSizes;

  constructor(
    private _router: Router,
    private _indexService: IndexService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _sidebar: SidenavService
  ) {
    this.dataSource = new MatTableDataSource<LiquidityPool>();
    this.displayedColumns = ['name', 'liquidity', 'stakingWeight', 'volumeDaily', 'rewards', 'options'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      if (this.subscription && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }

      this.subscription = new Subscription();

      this.subscription.add(
        this._indexService.getLatestBlock$()
          .pipe(switchMap(_ => this.getLiquidityPools$(this.filter?.cursor)))
          .subscribe());
    }
  }

  private getLiquidityPools$(cursor?: string): Observable<LiquidityPools> {
    this.filter.cursor = cursor;

    return this._liquidityPoolsService.getLiquidityPools(this.filter)
      .pipe(tap(pools => {
        this.dataSource.data = [...pools.results];
        this.paging = pools.paging;
      }));
  }

  navigate(name: string): void {
    this._router.navigateByUrl(`/pools/${name}`);
  }

  trackBy(index: number, pool: LiquidityPool): string {
    return `${index}-${pool?.trackBy}`;
  }

  pageChange(cursor: string): void {
    this.getLiquidityPools$(cursor).pipe(take(1)).subscribe();
  }

  provide(pool: any): void {
    this._sidebar.openSidenav(TransactionView.provide, {pool: pool});
  }

  swap(pool: any): void {
    this._sidebar.openSidenav(TransactionView.swap, {pool: pool});
  }

  stake(pool: any): void {
    this._sidebar.openSidenav(TransactionView.stake, {pool: pool});
  }

  mine(pool: any): void {
    this._sidebar.openSidenav(TransactionView.mine, {pool: pool});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
