import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class MarketsService extends CacheService {
  private readonly marketAddress = environment.marketAddress;

  constructor(private _platformApi: PlatformApiService) {
    super();
  }

  getMarket(): Observable<any> {
    return this.getItem(this.marketAddress, this._platformApi.getMarketOverview());
  }

  getMarketHistory(timeSpan: string = '1Y'): Observable<any> {
    return this.getItem(`${this.marketAddress}-history-${timeSpan}`, this._platformApi.getMarketHistory(timeSpan));
  }

  refreshMarket(): void {
    this.refreshItem(this.marketAddress);
  }

  refreshMarketHistory(timeSpan: string = '1Y'): void {
    this.refreshItem(`${this.marketAddress}-history-${timeSpan}`);
  }
}
