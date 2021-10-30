import { ILiquidityPoolsResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pools-response.interface';
import { IconSizes } from './../../../enums/icon-sizes';
import { Component, Input, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { MatSort } from '@angular/material/sort';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { LiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { Observable, Subscription } from 'rxjs';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-pools-table',
  templateUrl: './pools-table.component.html',
  styleUrls: ['./pools-table.component.scss']
})
export class PoolsTableComponent implements OnChanges, OnDestroy {
  @Input() filter: LiquidityPoolsFilter;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  pool$: Observable<ILiquidityPoolsResponse>;
  subscription: Subscription;
  paging: ICursor;
  iconSizes = IconSizes;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _router: Router,
    private _blocksService: BlocksService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _sidebar: SidenavService
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['name', 'liquidity', 'stakingWeight', 'volumeDaily', 'rewards', 'options'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.subscription = new Subscription();
      this.subscription.add(
        this._blocksService.getLatestBlock$()
          .pipe(switchMap(_ => this.getLiquidityPools$(this.filter?.cursor)))
          .subscribe())
    }
  }

  private getLiquidityPools$(cursor?: string): Observable<ILiquidityPoolsResponse> {
    this.filter.cursor = cursor;
    return this._liquidityPoolsService.getLiquidityPools(this.filter).pipe(tap(pools => {
      this.dataSource.data = [...pools.results];
      this.paging = pools.paging;
    }));
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/pools/${name}`);
  }

  trackBy(index: number, pool: any) {
    return pool.address; // Todo: Should also track by moving targets like liquidity or volume
  }

  pageChange(cursor: string) {
    this.getLiquidityPools$(cursor).pipe(take(1)).subscribe();
  }

  provide(pool: any) {
    this._sidebar.openSidenav(TransactionView.provide, {pool: pool});
  }

  swap(pool: any) {
    this._sidebar.openSidenav(TransactionView.swap, {pool: pool});
  }

  stake(pool: any) {
    this._sidebar.openSidenav(TransactionView.stake, {pool: pool});
  }

  mine(pool: any) {
    this._sidebar.openSidenav(TransactionView.mine, {pool: pool});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
