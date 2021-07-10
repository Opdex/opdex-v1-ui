import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ILiquidityPoolsSearchFilter, LiquidityPoolsSearchQuery } from '@sharedModels/requests/liquidity-pool-filter';
import { Observable } from 'rxjs';
import { SidenavService } from '@sharedServices/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';

@Component({
  selector: 'opdex-pools-table',
  templateUrl: './pools-table.component.html',
  styleUrls: ['./pools-table.component.scss']
})
export class PoolsTableComponent implements OnChanges, AfterViewInit {
  @Input() pools: any[];
  @Input() poolsFilter: ILiquidityPoolsSearchFilter;
  @Input() smallPageSize: boolean = false;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  searchQuery = new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 5);
  pageSizeOptions: number[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router, private _platformApi: PlatformApiService, private _sidebar: SidenavService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['name', 'liquidity', 'stakingWeight', 'volumeDaily', 'providerRewards', 'stakerRewards', 'options'];
  }

  ngOnChanges() {
    this.pageSizeOptions = this.smallPageSize ? [5, 10, 25] : [10, 25, 50];

    if (!this.pools?.length) return;

    this.dataSource.data = [...this.pools.filter(pool => pool != null)];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/pools/${name}`);
  }

  trackBy(index: number, pool: any) {
    return pool.name + pool.address
  }

  // Todo: Wait for API stories
  // Responses will need to include
  // - # of total pools used to properly build pagination

  // public applyFilter() {

  // }

  // public getNext(event: PageEvent) {

  // }

  // public handleSort(event: Sort) {

  // }

  // private getLiquidityPools(): Observable<any> {
  //   return this._platformApi.getPools();
  // }

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
}
