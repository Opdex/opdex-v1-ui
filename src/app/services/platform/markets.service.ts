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

  refreshMarket(): void {
    this.refreshItem(this.marketAddress);
  }
}
