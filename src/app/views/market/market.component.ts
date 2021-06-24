import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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
  pools: any[];
  tokens: any[];

  constructor(private _platformApiService: PlatformApiService) { }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.getMarket(),
      this.getMarketHistory(),
      this.getPools(),
      this.getTokens()
    ])
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
      .subscribe(pools => this.pools = pools);
  }

  private getTokens(): void {
    this._platformApiService.getTokens()
      .pipe(take(1))
      .subscribe(tokens => this.tokens = tokens);
  }
}
