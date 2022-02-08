import { Market } from '@sharedModels/ui/markets/market';
import { HistoryFilter } from '@sharedModels/platform-api/requests/history-filter';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';
import { IMarketHistoryResponse } from '@sharedModels/platform-api/responses/markets/market-history-response.interface';

@Injectable({ providedIn: 'root' })
export class MarketsService extends CacheService {
  constructor(private _platformApi: PlatformApiService, protected _injector: Injector) {
    super(_injector);
  }

  getMarket(): Observable<Market> {
    return this.getItem('market', this._platformApi.getMarketOverview());
  }

  getMarketHistory(request: HistoryFilter): Observable<IMarketHistoryResponse> {
    return this.getItem(`market-history-${request.buildQueryString()}`, this._platformApi.getMarketHistory(request));
  }
}
