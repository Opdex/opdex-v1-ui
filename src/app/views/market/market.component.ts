import { ILiquidityPoolSummaryResponse, ILiquidityPoolSnapshotHistoryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { LiquidityPoolsSearchQuery } from '@sharedModels/liquidity-pool-filter';

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
  volumeHistory: any[];
  pools: ILiquidityPoolSummaryResponse[];
  tokens: any[];
  miningPools$: Observable<ILiquidityPoolSummaryResponse[]>

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

        this.marketHistory.forEach(history => {
          liquidityPoints.push({
            time: Date.parse(history.startDate)/1000,
            value: history.liquidity
          });

          volumePoints.push({
            time: Date.parse(history.startDate)/1000,
            value: history.volume
          })
        });

        this.liquidityHistory = liquidityPoints;
        this.volumeHistory = volumePoints;
      });
  }

  private getPools(): void {
    this._platformApiService.getPools()
      .pipe(take(1))
      .subscribe(pools => {
        this.pools = pools;
      });
  }

  private getTokens(): void {
    this._platformApiService.getTokens()
    .pipe(
      take(1),
      switchMap((tokens: any[]) => {
        const poolArray$: Observable<any>[] = [];

        tokens.forEach(token => {
          const pool$: Observable<any> = this.getTokenHistory(token);
          poolArray$.push(pool$);
        });

        return forkJoin(poolArray$);
      })
    )
    .subscribe(tokens => {
      this.tokens = tokens;
    });
  }

  private getTokenHistory(token: any): Observable<any> {
    return this._platformApiService.getTokenHistory(token.address)
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
}
