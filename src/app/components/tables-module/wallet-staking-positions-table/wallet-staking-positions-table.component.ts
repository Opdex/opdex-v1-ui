import { IAddressStaking } from '@sharedModels/platform-api/responses/wallets/address-staking.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { EventEmitter, OnDestroy, Output } from '@angular/core';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { StakingPositionsFilter } from '@sharedModels/platform-api/requests/wallets/staking-positions-filter';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Subscription, of, Observable, forkJoin, combineLatest } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

@Component({
  selector: 'opdex-wallet-staking-positions-table',
  templateUrl: './wallet-staking-positions-table.component.html',
  styleUrls: ['./wallet-staking-positions-table.component.scss']
})
export class WalletStakingPositionsTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: StakingPositionsFilter;
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
    private _env: EnvironmentsService,
    private _platformApi: PlatformApiService
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['pool', 'status', 'position', 'value', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      if (this.subscription && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }

      this.subscription = new Subscription();

      this.subscription.add(
        this._indexService.latestBlock$
          .pipe(switchMap(_ => this.getStakingPositions$(this.filter?.cursor)))
          .subscribe());
    }
  }

  openSidebar(child: string, poolAddress: string): void {
    this._liquidityPoolService.getLiquidityPool(poolAddress).pipe(take(1)).subscribe(pool => {
      this._sidebar.openSidenav(TransactionView.stake, { pool, child })
    });
  }

  navigate(name: string): void {
    this._router.navigateByUrl(`/pools/${name}`);
  }

  trackBy(index: number, position: any): string {
    return `${index}-${position.name}-${position.address}-${position.position.formattedValue}-${position.value.formattedValue}-${position.isNominated}`;
  }

  pageChange(cursor: string): void {
    this.getStakingPositions$(cursor).pipe(take(1)).subscribe();
  }

  refreshPosition(liquidityPoolAddress: string): void {
    const {wallet} = this._userContext.getUserContext();

    combineLatest([
      this._liquidityPoolService.getLiquidityPool(liquidityPoolAddress),
      this._platformApi.refreshStakingPosition(wallet, liquidityPoolAddress)
    ])
    .pipe(take(1))
    .subscribe(([liquidityPool, position]) => {
      this.dataSource.data = this.dataSource.data.map(item =>
        item.liquidityPoolAddress === liquidityPoolAddress ? this._buildRecord(liquidityPool, position) : item);
    });
  }

  private getStakingPositions$(cursor?: string): Observable<any> {
    const context = this._userContext.getUserContext();
    if (!!context.wallet === false) return of(null);

    this.filter.cursor = cursor;

    return this._walletsService.getStakingPositions(context.wallet, this.filter)
      .pipe(
        switchMap(response => {
          this.onNumRecordsCount.emit(this._numRecords(response.paging, response.results));

          if (response.results.length === 0) {
            this.dataSource.data = [];
            return of(response);
          }

          const positions$: Observable<any>[] = [];

          response.results.forEach(position => {
            const stakingPositionDetails$: Observable<any> =
              this._liquidityPoolService.getLiquidityPool(position.liquidityPool)
                .pipe(
                  take(1),
                  map(pool => { return { pool, position }; }));

            positions$.push(stakingPositionDetails$);
          })

          return forkJoin(positions$)
            .pipe(map(positions => {
              this.dataSource.data = positions.map(({pool, position}) => this._buildRecord(pool, position));
              this.paging = response.paging;
            }));
        }));
  }

  private _buildRecord(pool: LiquidityPool, position: IAddressStaking): any {
    const price = !pool.tokens.staking?.summary ? FixedDecimal.Zero(8) : pool.tokens.staking.summary.priceUsd;
    const amount = new FixedDecimal(position.amount, pool.tokens.staking?.decimals);

    return {
      name: pool.name,
      poolTokens: [pool.tokens.crs, pool.tokens.src],
      stakingTokenSymbol: pool.tokens.staking?.symbol,
      liquidityPoolAddress: pool.address,
      position: amount,
      decimals: pool.tokens.lp.decimals,
      isNominated: pool.summary?.staking?.nominated === true,
      isCurrentMarket: pool.market === this._env.marketAddress,
      value: price.multiply(amount)
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
