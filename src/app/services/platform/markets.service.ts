import { IMarket } from '@sharedModels/platform-api/responses/markets/market.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';
import { IMarketSnapshot } from '@sharedModels/platform-api/responses/markets/market-snapshot.interface';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';

@Injectable({ providedIn: 'root' })
export class MarketsService extends CacheService {
  private marketAddress: string;

  constructor(private _platformApi: PlatformApiService, private _env: EnvironmentsService, protected _injector: Injector) {
    super(_injector);
    this.marketAddress = this._env.marketAddress;
  }

  getMarket(): Observable<IMarket> {
    return this.getItem(this.marketAddress, this._platformApi.getMarketOverview());
  }

  getMarketHistory(timeSpan: string = '1Y'): Observable<IMarketSnapshot[]> {
    return this.getItem(`${this.marketAddress}-history-${timeSpan}`, this._platformApi.getMarketHistory(timeSpan));
  }

  refreshMarket(): void {
    this.refreshItem(this.marketAddress);
  }

  refreshMarketHistory(timeSpan: string = '1Y'): void {
    this.refreshItem(`${this.marketAddress}-history-${timeSpan}`);
  }
}
