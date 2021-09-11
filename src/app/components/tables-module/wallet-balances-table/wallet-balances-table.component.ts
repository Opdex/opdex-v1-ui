import { MathService } from '@sharedServices/utility/math.service';
import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { SidenavService } from '@sharedServices/utility/sidenav.service';

@Component({
  selector: 'opdex-wallet-balances-table',
  templateUrl: './wallet-balances-table.component.html',
  styleUrls: ['./wallet-balances-table.component.scss']
})
export class WalletBalancesTableComponent implements OnChanges, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @Input() tokens: any[];
  @Input() pageSize: number;
  @Input() smallPageSize: boolean = false;
  pageSizeOptions: number[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router, private _sidebar: SidenavService, private _math: MathService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['name', 'balance', 'total', 'actions'];
  }

  ngOnChanges() {
    this.pageSizeOptions = this.smallPageSize ? [5, 10, 25] : [10, 25, 50];

    if (!this.tokens?.length) return;

    this.dataSource.data = this.tokens.map(t => {
      return {
        name: t.name,
        symbol: t.symbol,
        address: t.address,
        balance: t.balance.balance,
        decimals: t.decimals,
        total: this._math.multiply(t.balance.balance, t.summary.price.close as number)
      }
    });
  }

  provide(pool: any) {
    return;
    this._sidebar.openSidenav(TransactionView.provide, {pool: pool});
  }

  swap(pool: any) {
    return;
    this._sidebar.openSidenav(TransactionView.swap, {pool: pool});
  }

  stake(pool: any) {
    return;
    this._sidebar.openSidenav(TransactionView.stake, {pool: pool});
  }

  mine(pool: any) {
    return;
    this._sidebar.openSidenav(TransactionView.mine, {pool: pool});
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/tokens/${name}`);
  }

  trackBy(index: number, pool: any) {
    return pool.name + pool.address
  }
}
