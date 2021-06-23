import { PlatformApiService } from '../../services/api/platform-api.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

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

  private async getMarket():Promise<void> {
    const marketResponse = await this._platformApiService.getMarketOverview();
    if (marketResponse.hasError || !marketResponse.data) {
      // handle
    }

    this.market = marketResponse.data;
  }

  private async getMarketHistory():Promise<void> {
    const marketResponse = await this._platformApiService.getMarketHistory();
    if (marketResponse.hasError || !marketResponse.data) {
      // handle
    }

    let liquidityPoints = [];
    let volumePoints = [];

    this.marketHistory = marketResponse.data;

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



  }

  private async getPools():Promise<void> {
    const poolsResponse = await this._platformApiService.getPools();
    if (poolsResponse.hasError || poolsResponse.data?.length) {
      // handle
    }

    this.pools = poolsResponse.data;
  }

  private async getTokens():Promise<void> {
    const tokensResponse = await this._platformApiService.getTokens();
    if (tokensResponse.hasError || tokensResponse.data?.length) {
      // handle
    }

    this.tokens = tokensResponse.data;
  }
}
