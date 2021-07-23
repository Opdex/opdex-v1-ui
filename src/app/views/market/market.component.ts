import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { LiquidityPoolsSearchQuery } from '@sharedModels/requests/liquidity-pool-filter';

@Component({
  selector: 'opdex-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
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
      prefix: '$'
    },
    {
      type: 'bar',
      category: 'Volume',
      prefix: '$'
    },
    {
      type: 'line',
      category: 'Staking Weight',
      suffix: 'ODX'
    }
  ]
  selectedChart = this.chartOptions[0];

  constructor(private _platformApiService: PlatformApiService) { }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.getMarket(),
      this.getMarketHistory(),
      this.getPools(),
      this.getTokens()
    ])

    this.miningPools$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {mining: true}));
  }

  private getMarket(): void {
    this._platformApiService.getMarketOverview()
      .pipe(take(1))
      .subscribe(market => this.market = market);
  }

  private getMarketHistory(): void {
    this._platformApiService.getMarketHistory()
      .pipe(take(1))
      .subscribe(marketHistory => {
        this.marketHistory = marketHistory;

        let liquidityPoints = [];
        let volumePoints = [];
        let stakingPoints = [];

        this.marketHistory.forEach(history => {
          const time = Date.parse(history.startDate.toString())/1000;

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
      });
  }

  private getPools(): void {
    this._platformApiService.getPools()
      .pipe(take(1))
      .subscribe(pools => {
        this.pools = pools;

        this.transactionRequest = {
          limit: 25,
          eventTypes: ['DistributionEvent', 'SwapEvent', 'ProvideEvent', 'MineEvent', 'CollectStakingRewardsEvent', 'CollectMiningRewardsEvent', 'NominationEvent'],
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
      });
  }

  private getTokens(): void {
    this._platformApiService.getTokens()
    .pipe(
      take(1),
      switchMap((tokens: any[]) => {
        const tokens$: Observable<any>[] = [];

        tokens.forEach(token => {
          const tokenWithHistory$: Observable<any> = this.getTokenHistory(token);
          tokens$.push(tokenWithHistory$);
        });

        return forkJoin(tokens$);
      })
    )
    .subscribe(tokens => {
      this.tokens = tokens;
    });
  }

  private getTokenHistory(token: any): Observable<any> {
    return this._platformApiService.getTokenHistory(token.address, "1W")
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
}
