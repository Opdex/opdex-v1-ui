import { MathService } from '@sharedServices/utility/math.service';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-wallet-balances-table',
  templateUrl: './wallet-balances-table.component.html',
  styleUrls: ['./wallet-balances-table.component.scss']
})
export class WalletBalancesTableComponent implements OnChanges {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @Input() records: any;
  @Input() pageSize: number;
  previous: string;
  next: string;
  icons = Icons;

  @Output() onPageChange: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router, private _sidebar: SidenavService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['token', 'name', 'balance', 'total', 'actions'];
  }

  ngOnChanges() {
    if (!this.records) return;
    if (!this.records.balances?.length) return;

    this.dataSource.data = this.records.balances.map(t => {
      return {
        name: t.name,
        symbol: t.symbol,
        address: t.address,
        balance: t.balance.balance,
        decimals: t.decimals,
        total: MathService.multiply(
          new FixedDecimal(t.balance.balance, t.decimals),
          new FixedDecimal(t.summary.priceUsd.toString(), 8))
      }
    });

    this.next = this.records.paging?.next;
    this.previous = this.records.paging?.previous;
  }

  pageChange(cursor: string) {
    this.onPageChange.emit(cursor);
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

  navigate(name: string) {
    this._router.navigateByUrl(`/tokens/${name}`);
  }

  trackBy(index: number, pool: any) {
    return pool.name + pool.address
  }
}
