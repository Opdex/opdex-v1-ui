import { IMarketToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { CacheService } from '../utility/cache.service';

@Injectable({providedIn: 'root'})
export class TokensService extends CacheService {

  constructor(private _platformApi: PlatformApiService, protected _injector: Injector) {
    super(_injector);
  }

  getToken(address: string, cacheOnly?: boolean): Observable<IToken | IMarketToken> {
    return address === 'CRS'
      ? this.getItem(address, this._platformApi.getToken(address), cacheOnly)
      : this.getItem(address, this._platformApi.getMarketToken(address), cacheOnly);
  }

  getTokens(limit: number = 10, includeLpt: boolean = false): Observable<IToken[]> {
    return this.getItem(`tokens-${limit}-${includeLpt}`, this._platformApi.getTokens());
  }

  getTokenHistory(address: string, timeSpan: string = "1Y", candleSpan: string = "Hourly"): Observable<any> {
    return this.getItem(`${address}-history-${timeSpan}-${candleSpan}`, this._platformApi.getTokenHistory(address, timeSpan, candleSpan));
  }

  refreshToken(address: string): void {
    this.refreshItem(address);
  }

  refreshTokens(limit: number = 10, includeLpt: boolean = false): void {
    this.refreshItem(`tokens-${limit}-${includeLpt}`);
  }

  refreshTokenHistory(address: string, timeSpan: string = "1Y", candleSpan: string = "Hourly"): void {
    this.refreshItem(`${address}-history-${timeSpan}-${candleSpan}`);
  }
}
