import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';

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
  icons = Icons;
  iconSizes = IconSizes;
  loading = true;

  @Output() onPageChange: EventEmitter<string> = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router, private _sidebar: SidenavService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['pool', 'status', 'position', 'value', 'actions'];
  }

  ngOnChanges() {
    if (!this.records) return;
    else this.loading = false;

    if (!this.records.positions?.length) return;

    this.dataSource.data = this.records.positions.map(p => {
      return {
        name: p.pool.name,
        stakingTokenSymbol: p.pool.summary.staking?.token.symbol,
        liquidityPoolAddress: p.pool.address,
        position: p.position.amount,
        decimals: p.pool.token.lp.decimals,
        isNominated: p.pool?.summary?.staking.isNominated === true,
        value: MathService.multiply(
          new FixedDecimal(p.position.amount, p.pool.summary.staking?.token.decimals),
          new FixedDecimal(p.pool.summary.staking?.token.summary.priceUsd.toString(), 8))
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
