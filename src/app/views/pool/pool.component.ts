import { environment } from '@environments/environment';
import { UserContextService } from '@sharedServices/user-context.service';
import { take, tap, switchMap, catchError } from 'rxjs/operators';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from '@sharedServices/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { timer, Subscription, Observable, of, zip } from 'rxjs';
import { ILiquidityPoolSnapshotHistoryResponse, ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';
import { StatCardInfo } from '@sharedComponents/cards-module/stat-card/stat-card-info';
import { IAddressBalanceResponse } from '@sharedModels/responses/platform-api/Addresses/address_balance.interface';

@Component({
  selector: 'opdex-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, OnDestroy {
  poolAddress: string;
  pool: ILiquidityPoolSummaryResponse;
  poolHistory: ILiquidityPoolSnapshotHistoryResponse;
  crsBalance: IAddressBalanceResponse;
  srcBalance$: Observable<IAddressBalanceResponse>;
  transactions: any[];
  liquidityHistory: any[] = [];
  stakingHistory: any[] = [];
  volumeHistory: any[] = [];
  crsPerSrcHistory: any[] = [];
  srcPerCrsHistory: any[] = [];
  walletBalance: any;
  subscription = new Subscription();
  copied: boolean;
  transactionsRequest: ITransactionsRequest;
  chartData: any[];
  chartOptions = [
    {
      type: 'line',
      category: 'Liquidity',
      prefix: '$',
      decimals: 2
    },
    {
      type: 'bar',
      category: 'Volume',
      prefix: '$',
      decimals: 2
    },
    {
      type: 'line',
      category: 'Staking Weight',
      suffix: 'ODX',
      decimals: 2
    },
    {
      type: 'candle',
      category: 'SRC/CRS Cost',
      suffix: 'SRC',
      decimals: 8
    },
    {
      type: 'candle',
      category: 'CRS/SRC Cost',
      suffix: 'CRS',
      decimals: 8
    }
  ]
  selectedChart = this.chartOptions[0];
  statCards: StatCardInfo[];

  constructor(
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService,
    private _userContext: UserContextService,
    private _sidenav: SidenavService
  ) {
    this.poolAddress = this._route.snapshot.params.pool;
  }

  async ngOnInit(): Promise<void> {
    // 30 seconds refresh view
    this.subscription.add(
      timer(0, 30000)
        .pipe(
          // RXJS implementation of Promise.All, fire all requests at the same time
          switchMap(() => zip(this.getPool(), this.getPoolHistory(), this.getCrsBalance(), this.getWalletSummary())),
          tap(() => {
            this.chartOptions.map(o => {
              if (o.suffix === 'SRC') {
                o.suffix = this.pool.token.src.symbol;
                o.decimals = this.pool.token.src.decimals
              }

              if (o.category.includes('SRC')) {
                o.category = o.category.replace('SRC', this.pool.token.src.symbol);
              }

              return o;
            });
          })
        ).subscribe());
  }

  openTransactionSidebar(view: TransactionView, childView: string = null) {
    const data = {
      pool: this.pool,
      child: childView
    }

    this._sidenav.openSidenav(view, data);
  }

  private getPool(): Observable<ILiquidityPoolSummaryResponse> {
    return this._platformApiService.getPool(this.poolAddress)
      .pipe(
        take(1),
        tap(pool => this.pool = pool),
        tap((pool) => {
          const miningGovernance = environment.governanceAddress;

          var contracts = [pool.address, pool.token.src.address, miningGovernance];

          if (pool?.mining?.address)
            contracts.push(pool.mining.address);

          this.transactionsRequest = {
            limit: 10,
            direction: "DESC",
            contracts: contracts,
            eventTypes: ['SwapEvent', 'ProvideEvent', 'StakeEvent', 'CollectStakingRewardsEvent', 'MineEvent', 'CollectMiningRewardsEvent', 'EnableMiningEvent', 'NominationEvent',]
          };
          if (this.pool){
            this.setPoolStatCards();
          }
        })
      );
  }

  private setPoolStatCards(): void {
    this.statCards = [
      {
        title: 'Liquidity', 
        value: this.pool.reserves.usd.toString(),
        prefix: '$',
        change: this.pool.reserves.usdDailyChange,
        show: true,
        helpInfo: {
          title: 'Liquidity Help',
          paragraph: 'This modal is providing help for Liquidity'
        }
      },
      {
        title: 'Staking Weight', 
        value: this.pool.staking?.weight,
        suffix: this.pool.token.staking?.symbol,
        change: this.pool.staking?.weightDailyChange || 0,
        formatNumber: 0, 
        show: true,
        helpInfo: {
          title: 'Staking Weight Help',
          paragraph: 'This modal is providing help for Staking Weight.'
        }
      },
      {
        title: 'Volume', 
        value: this.pool.volume.usd.toString(),
        prefix: '$',
        daily: true,
        show: true,
        helpInfo: {
          title: 'Volume Help',
          paragraph: 'This modal is providing help for Volume'
        }
      },
      {
        title: 'Rewards', 
        value: this.pool.rewards.totalUsd.toString(),
        daily: true,
        prefix: '$',
        show: true,
        helpInfo: {
          title: 'Rewards Help',
          paragraph: 'This modal is providing help for Rewards'
        }
      },
      {
        title: 'Liquidity Mining', 
        value: this.pool.mining?.tokensMining,
        formatNumber: 0, 
        suffix: this.pool.token.lp.symbol,
        show: this.pool.mining != null && (this.pool.mining?.isActive || this.pool.mining?.tokensMining !== '0.00000000'),
        helpInfo: {
          title: 'Liquidity Mining Help',
          paragraph: 'This modal is providing help for Liquidity Mining'
        }
      }
    ];
  }

  private getCrsBalance(): Observable<IAddressBalanceResponse> {

    const context = this._userContext.getUserContext();

    if (context.wallet) {
      return this._platformApiService.getBalance(context.wallet, 'CRS')
        .pipe(tap((rsp: IAddressBalanceResponse) => this.crsBalance = rsp), catchError(() => of(null)));
    }

    return of();
  }

  private getWalletSummary(): Observable<any> {
    const context = this._userContext.getUserContext();

    if (context.wallet) {
      return this._platformApiService.getWalletSummaryForPool(this.poolAddress, context.wallet)
        .pipe(take(1), tap(walletSummary => this.walletBalance = walletSummary));
    }

    return of();
  }

  private getPoolHistory(): Observable<ILiquidityPoolSnapshotHistoryResponse> {
    return this._platformApiService.getPoolHistory(this.poolAddress)
      .pipe(take(1),
        tap((poolHistory: ILiquidityPoolSnapshotHistoryResponse) => {
          this.poolHistory = poolHistory;

          let liquidityPoints = [];
          let volumePoints = [];
          let stakingPoints = [];
          let crsPerSrcHistory = [];
          let srcPerCrsHistory = [];

          this.poolHistory.snapshotHistory.forEach(history => {
            const time = Date.parse(history.startDate.toString()) / 1000;

            liquidityPoints.push({
              time,
              value: history.reserves.usd
            });

            volumePoints.push({
              time,
              value: history.volume.usd
            });

            stakingPoints.push({
              time,
              value: parseFloat(history.staking.weight.split('.')[0])
            });

            crsPerSrcHistory.push({
              time,
              open: history.cost.crsPerSrc.open,
              high: history.cost.crsPerSrc.high,
              low: history.cost.crsPerSrc.low,
              close: history.cost.crsPerSrc.close,
            });

            srcPerCrsHistory.push({
              time,
              open: history.cost.srcPerCrs.open,
              high: history.cost.srcPerCrs.high,
              low: history.cost.srcPerCrs.low,
              close: history.cost.srcPerCrs.close,
            })
          });

          this.liquidityHistory = liquidityPoints;
          this.volumeHistory = volumePoints;
          this.stakingHistory = stakingPoints;
          this.crsPerSrcHistory = crsPerSrcHistory;
          this.srcPerCrsHistory = srcPerCrsHistory;

          this.handleChartTypeChange(this.selectedChart.category);
        }));
  }

  copyHandler($event) {
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 1000);
  }

  handleChartTypeChange($event) {
    this.selectedChart = this.chartOptions.find(options => options.category === $event);

    if ($event === 'Liquidity') {
      this.chartData = this.liquidityHistory;
    } else if ($event === 'Volume') {
      this.chartData = this.volumeHistory;
    } else if ($event === 'Staking Weight') {
      this.chartData = this.stakingHistory;
    } else if ($event === `CRS/${this.pool.token.src.symbol} Cost`) {
      this.chartData = this.crsPerSrcHistory;
    } else if ($event === `${this.pool.token.src.symbol}/CRS Cost`) {
      this.chartData = this.srcPerCrsHistory;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
