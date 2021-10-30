import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';

@Component({
  selector: 'opdex-wallet-mining-positions-table',
  templateUrl: './wallet-mining-positions-table.component.html',
  styleUrls: ['./wallet-mining-positions-table.component.scss']
})
export class WalletMiningPositionsTableComponent implements OnChanges {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @Input() records: any;
  @Input() pageSize: number;
  previous: string;
  next: string;

  @Output() onPageChange: EventEmitter<string> = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router, private _sidebar: SidenavService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['pool', 'status', 'position', 'value', 'actions'];
  }

  ngOnChanges() {
    if (!this.records) return;

    if (!this.records.positions?.length) return;

    this.dataSource.data = this.records.positions.map(p => {
      return {
        name: p.pool.name,
        miningTokenSymbol: p.pool.token.lp.symbol,
        liquidityPoolAddress: p.pool.address,
        miningPoolAddress: p.position.miningPool,
        position: p.position.amount,
        isActive: p.pool.mining?.isActive === true,
        decimals: p.pool.token.lp.decimals,
        value: MathService.multiply(
          new FixedDecimal(p.position.amount, p.pool.token.lp.decimals),
          new FixedDecimal(p.pool.token.lp.summary.priceUsd.toString(), 8))
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
    this._router.navigateByUrl(`/pools/${name}`);
  }

  trackBy(index: number, pool: any) {
    return pool.name + pool.address
  }
}
