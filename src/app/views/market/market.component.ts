import { TokensService } from '@sharedServices/platform/tokens.service';
import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnInit } from '@angular/core';
import { forkJoin, interval, Observable, Subscription, zip } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { LiquidityPoolsSearchQuery } from '@sharedModels/requests/liquidity-pool-filter';
import { StatCardInfo } from '@sharedComponents/cards-module/stat-card/stat-card-info';
import { MarketsService } from '@sharedServices/platform/markets.service';

@Component({
  selector: 'opdex-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
  subscription = new Subscription();
  theme$: Observable<string>;
  market: any;
  marketHistory: any[];
  liquidityHistory: any[];
  stakingHistory: any[];
  volumeHistory: any[];
  pools: ILiquidityPoolSummaryResponse[];
  tokens: any[];
  miningPools$: Observable<ILiquidityPoolSummaryResponse[]>
  transactionRequest: ITransactionsRequest;
  chartData: any[];
  chartOptions = [
    {
      type: 'line',
      category: 'Liquidity',
      prefix: '$',
      decimals: 3
    },
    {
      type: 'bar',
      category: 'Volume',
      prefix: '$',
      decimals: 3
    },
    {
      type: 'line',
      category: 'Staking Weight',
      suffix: 'ODX',
      decimals: 0
    }
  ];
  statCards: StatCardInfo[];
  selectedChart = this.chartOptions[0];

  constructor(private _platformApiService: PlatformApiService, private _marketsService: MarketsService, private _tokensService: TokensService) { }

  async ngOnInit(): Promise<void> {
    this.subscription.add(interval(5000)
      .pipe(tap(_ => {
        this._marketsService.refreshMarket();
        this._marketsService.refreshMarketHistory();
      }))
      .subscribe());

    const combo = [this.getMarketHistory(), this.getPools(), this.getTokens()];

    this.subscription.add(this.getMarket()
      .pipe(switchMap(() => zip(...combo)))
      .subscribe());

    this.miningPools$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {mining: true}));
  }

  private getMarket(): Observable<any> {
    return this._marketsService.getMarket()
      .pipe(tap(market => {
        this.market = market;
        this.setMarketStatCards();
      }));
  }

  private setMarketStatCards(): void {
    this.statCards = [
      {
        title: 'Cirrus (CRS)',
        value: this.market.crsToken.summary.price.close,
        prefix: '$',
        formatNumber: 2,
        change: this.market.crsToken.summary.dailyPriceChange,
        show: true,
        helpInfo: {
          title: 'Cirrus (CRS) Help',
          paragraph: 'This modal is providing help for Cirrus (CRS)'
        }
      },
      {
        title: 'Liquidity',
        value: this.market.summary.liquidity,
        prefix: '$',
        change: this.market.summary.liquidityDailyChange,
        show: true,
        helpInfo: {
          title: 'Liquidity Help',
          paragraph: 'This modal is providing help for Liquidity'
        }
      },
      {
        title: 'Staking Weight',
        value: this.market.summary.staking.weight,
        suffix: this.market.stakingToken.symbol,
        change: this.market.summary.staking.weightDailyChange,
        formatNumber: 0,
        show: true,
        helpInfo: {
          title: 'Staking Weight Help',
          paragraph: 'This modal is providing help for Staking Weight.'
        }
      },
      {
        title: 'Volume',
        value: this.market.summary.volume,
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
        value: this.market.summary.rewards.totalUsd,
        daily: true,
        prefix: '$',
        show: true,
        helpInfo: {
          title: 'Rewards Help',
          paragraph: 'This modal is providing help for Rewards'
        }
      }
    ];
  }

  private getMarketHistory(): Observable<void> {
    return this._marketsService.getMarketHistory()
      .pipe(
        take(1),
        delay(10),
        map(marketHistory => {
          this.marketHistory = marketHistory;

          let liquidityPoints = [];
          let volumePoints = [];
          let stakingPoints = [];

          this.marketHistory.forEach(history => {
            const time = Date.parse(history.startDate.toString()) / 1000;

            liquidityPoints.push({
              time,
              value: history.liquidity
            });

            volumePoints.push({
              time,
              value: history.volume
            });

            stakingPoints.push({
              time,
              value: parseFloat(history.staking.weight.split('.')[0])
            });
          });

          this.liquidityHistory = liquidityPoints;
          this.volumeHistory = volumePoints;
          this.stakingHistory = stakingPoints;

          this.handleChartTypeChange(this.selectedChart.category);
        }));
  }

  private getPools(): Observable<void> {
    return this._platformApiService.getPools()
      .pipe(
        take(1),
        map(pools => {
        this.pools = pools;

        this.transactionRequest = {
          limit: 10,
          eventTypes: ['CreateLiquidityPoolEvent', 'DistributionEvent', 'SwapEvent', 'AddLiquidityEvent', 'RemoveLiquidityEvent', 'StartStakingEvent', 'StopStakingEvent', 'StartMiningEvent', 'StopMiningEvent', 'CollectStakingRewardsEvent', 'CollectMiningRewardsEvent', 'NominationEvent'],
          direction: 'DESC'
        }

        if (!this.transactionRequest?.contracts?.length) return;

        pools.forEach(pool => {
          if (!this.transactionRequest.contracts.includes(pool.address)) {
            this.transactionRequest.contracts.push(pool.address);
          }

          if (pool.mining?.address && !this.transactionRequest.contracts.includes(pool.mining.address)) {
            this.transactionRequest.contracts.push(pool.mining.address);
          }

          if (pool.token?.staking?.address && !this.transactionRequest.contracts.includes(pool.token.staking.address)) {
            this.transactionRequest.contracts.push(pool.token.staking.address);
          }
        });
      }));
  }

  private getTokens(): Observable<any[]> {
    return this._platformApiService.getTokens(10, false)
      .pipe(
        take(1),
        switchMap((tokens: any[]) => {
          const tokens$: Observable<any>[] = [];

          tokens.forEach(token => {
            if (this.tokens) {
              this._tokensService.refreshTokenHistory(token.address, '1W', 'Hourly');
            }

            const tokenWithHistory$: Observable<any> = this.getTokenHistory(token);
            tokens$.push(tokenWithHistory$);
          });

          return forkJoin(tokens$);
        }),
        tap(tokens => this.tokens = tokens)
      );
  }

  private getTokenHistory(token: any): Observable<any> {
    return this._tokensService.getTokenHistory(token.address, "1W", "Hourly")
      .pipe(
        take(1),
        map((tokenHistory: any) => {
          let liquidityPoints: any[] = [];

          tokenHistory.snapshotHistory.forEach(history => {
            liquidityPoints.push({
              time: Date.parse(history.startDate.toString())/1000,
              value: history.price.close
            });
          });

          token.snapshotHistory = liquidityPoints;

          return token;
        }));
  }

  handleChartTypeChange($event) {
    this.selectedChart = this.chartOptions.find(options => options.category === $event);

    if ($event === 'Liquidity') {
      this.chartData = this.liquidityHistory;
    }

    if ($event === 'Volume') {
      this.chartData = this.volumeHistory;
    }

    if ($event === 'Staking Weight') {
      this.chartData = this.stakingHistory;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
