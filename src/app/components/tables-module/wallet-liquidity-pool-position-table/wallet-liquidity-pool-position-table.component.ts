import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { MathService } from '@sharedServices/utility/math.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';

@Component({
  selector: 'opdex-wallet-liquidity-pool-position-table',
  templateUrl: './wallet-liquidity-pool-position-table.component.html',
  styleUrls: ['./wallet-liquidity-pool-position-table.component.scss']
})
export class WalletLiquidityPoolPositionTableComponent implements OnChanges, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @Input() positions: any[];
  @Input() pool: ILiquidityPoolSummary;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router, private _sidebar: SidenavService, private _math: MathService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['token', 'position', 'amount', 'value', 'actions'];
  }

  ngOnChanges() {
    if (!this.positions?.length) return;

    this.dataSource.data = this.positions;
  }

  provide(child: string) {
    this._sidebar.openSidenav(TransactionView.provide, {pool: this.pool, child});
  }

  swap() {
    this._sidebar.openSidenav(TransactionView.swap, {pool: this.pool});
  }

  stake(child: string) {
    this._sidebar.openSidenav(TransactionView.stake, {pool: this.pool, child});
  }

  mine(child: string) {
    this._sidebar.openSidenav(TransactionView.mine, {pool: this.pool, child});
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navigate(address: string) {
    this._router.navigateByUrl(`/tokens/${address}`);
  }

  trackBy(index: number, position: any) {
    return position.token.name + position.amount
  }
}
