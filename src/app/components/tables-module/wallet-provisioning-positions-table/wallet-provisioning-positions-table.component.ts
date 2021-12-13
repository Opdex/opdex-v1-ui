import { IconSizes } from 'src/app/enums/icon-sizes';
import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-wallet-provisioning-positions-table',
  templateUrl: './wallet-provisioning-positions-table.component.html',
  styleUrls: ['./wallet-provisioning-positions-table.component.scss']
})
export class WalletProvisioningPositionsTableComponent implements OnChanges {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @Input() records: any;
  @Input() pageSize: number;
  previous: string;
  next: string;
  icons = Icons;
  iconSizes = IconSizes;
  loading = true;

  @Output() onPageChange: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router, private _sidebar: SidenavService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['pool', 'token', 'balance', 'total', 'actions'];
  }

  ngOnChanges() {
    if (!this.records) return;
    else this.loading = false;

    if (!this.records.balances?.length) return;

    this.dataSource.data = this.records.balances.map(t => {
      return {
        pool: t.name,
        token: t.symbol,
        address: t.address,
        balance: t.balance.balance,
        decimals: t.decimals,
        total: MathService.multiply(
          new FixedDecimal(t.balance.balance, t.decimals),
          new FixedDecimal(t.summary?.priceUsd?.toString() || '0', 8))
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
