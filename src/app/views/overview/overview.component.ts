import { PlatformApiService } from './../../services/api/platform-api.service';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@sharedServices/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  chartType: string = 'Area';
  ohlcPoints: any[];
  theme$: Observable<string>;
  market: any;
  pools: any[];
  tokens: any[];

  constructor(
    private _themeService: ThemeService,
    private _platformApiService: PlatformApiService
  ) {
    this.theme$ = this._themeService.getTheme();
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => this.ohlcPoints = [], 100)

    await Promise.all([
      this.getMarket(),
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
