import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';

@Component({
  selector: 'opdex-wallet-staking-positions-table',
  templateUrl: './wallet-staking-positions-table.component.html',
  styleUrls: ['./wallet-staking-positions-table.component.scss']
})
export class WalletStakingPositionsTableComponent implements OnChanges {
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
        name: `${p.pool.token.src.symbol}-${p.pool.token.crs.symbol}`,
        stakingTokenSymbol: p.pool.token.staking.symbol,
        liquidityPoolAddress: p.pool.address,
        position: p.position.amount,
        decimals: p.pool.token.lp.decimals,
        isNominated: p.pool?.staking.isNominated === true,
        value: MathService.multiply(
          new FixedDecimal(p.position.amount, p.pool.token.staking.decimals),
          new FixedDecimal(p.pool.token.staking.summary.price.close.toString(), 8))
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
