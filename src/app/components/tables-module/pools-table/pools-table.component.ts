import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ILiquidityPoolsSearchFilter, LiquidityPoolsSearchQuery } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';

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

  constructor(private _router: Router, private _sidebar: SidenavService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['name', 'liquidity', 'stakingWeight', 'volumeDaily', 'rewards', 'options'];
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
