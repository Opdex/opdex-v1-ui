import { IAddressMining } from '@sharedModels/platform-api/responses/wallets/address-mining.interface';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { EventEmitter, OnDestroy, Output } from '@angular/core';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MiningPositionsFilter } from '@sharedModels/platform-api/requests/wallets/mining-positions-filter';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { TransactionView } from '@sharedModels/transaction-view';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IndexService } from '@sharedServices/platform/index.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Subscription, of, Observable, forkJoin, lastValueFrom } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-wallet-mining-positions-table',
  templateUrl: './wallet-mining-positions-table.component.html',
  styleUrls: ['./wallet-mining-positions-table.component.scss']
})
export class WalletMiningPositionsTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: MiningPositionsFilter;
  @Output() onNumRecordsCount = new EventEmitter<string>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  subscription: Subscription;
  paging: ICursor;
  icons = Icons;
  iconSizes = IconSizes;

  constructor(
    private _router: Router,
    private _sidebar: SidenavService,
    private _walletsService: WalletsService,
    private _liquidityPoolService: LiquidityPoolsService,
    private _indexService: IndexService,
    private _userContext: UserContextService,
    private _env: EnvironmentsService
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['pool', 'status', 'position', 'value', 'valueCrs', 'valueSrc', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      if (this.subscription && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }

      this.subscription = new Subscription();

      this.subscription.add(
        this._indexService.latestBlock$
          .pipe(switchMap(_ => this.getMiningPositions$(this.filter?.cursor)))
          .subscribe());
    }
  }

  openSidebar(child: string, poolAddress: string): void {
    this._liquidityPoolService.getLiquidityPool(poolAddress).pipe(take(1)).subscribe(pool => {
      this._sidebar.openSidenav(TransactionView.mine, { pool, child })
    });
  }

  navigate(name: string): void {
    this._router.navigateByUrl(`/pools/${name}`);
  }

  trackBy(index: number, record: any): string {
    return `${index}-${record.name}-${record.address}-${record.position.formattedValue}-${record.value.formattedValue}-${record.isActive}`;
  }

  pageChange(cursor: string): void {
    this.getMiningPositions$(cursor).pipe(take(1)).subscribe();
  }

  async refreshPosition(liquidityPoolAddress: string, miningPoolAddress: string): Promise<void> {
    const {wallet} = this._userContext.userContext;

    this.dataSource.data = this.dataSource.data.map(item => {
      if (item.liquidityPoolAddress === liquidityPoolAddress) {
        item.refreshing = true;
      }

      return item;
    });

    await lastValueFrom(this._walletsService.refreshMiningPosition(wallet, miningPoolAddress));
  }

  private getMiningPositions$(cursor?: string): Observable<any> {
    const context = this._userContext.userContext;
    if (!!context.wallet === false) return of(null);

    this.filter.cursor = cursor;

    return this._walletsService.getMiningPositions(context.wallet, this.filter)
      .pipe(
        switchMap(response => {
          this.onNumRecordsCount.emit(this._numRecords(response.paging, response.results));

          if (response.results.length === 0) {
            this.dataSource.data = [];
            return of(response);
          }

          const positions$: Observable<any>[] = [];

          response.results.forEach(position => {
            const miningPositionDetails$: Observable<any> =
              this._liquidityPoolService.getLiquidityPool(position.miningToken)
                .pipe(take(1), map(pool => { return { pool, position } }));

            positions$.push(miningPositionDetails$);
          })

          return forkJoin(positions$)
            .pipe(
              map(positions => {
                this.dataSource.data = positions.map(({ pool, position }) => this._buildRecord(pool, position));
                this.paging = response.paging;
              }));
        }));
  }

  private _buildRecord(pool: LiquidityPool, position: IAddressMining): any {
    const price = pool.tokens.lp.summary.priceUsd;
    const amount = new FixedDecimal(position.amount, pool.tokens.lp.decimals);
    const valueCrs = amount.divide(pool.tokens.lp.totalSupply).multiply(pool.summary.reserves.crs);
    const valueSrc = amount.divide(pool.tokens.lp.totalSupply).multiply(pool.summary.reserves.src);

    return {
      pool,
      position: amount,
      isCurrentMarket: pool.market === this._env.marketAddress,
      value: price.multiply(amount),
      valueCrs,
      valueSrc
    }
  }

  private _numRecords(paging: ICursor, records: any[]): string {
    return paging.next || paging.previous
      ? `${this.filter.limit}+`
      : records.length.toString();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
