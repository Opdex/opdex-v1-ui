import { ITokensResponse } from '@sharedModels/platform-api/responses/tokens/tokens-response.interface';
import { IMarketToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { CacheService } from '../utility/cache.service';
import { TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';

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

  getTokens(request: TokensFilter): Observable<ITokensResponse> {
    return this.getItem(`transactions-request-${request.buildQueryString()}`, this._platformApi.getMarketTokens(request));
  }

  getTokenHistory(address: string, timeSpan: string = "1Y", candleSpan: string = "Hourly"): Observable<any> {
    return this.getItem(`${address}-history-${timeSpan}-${candleSpan}`, this._platformApi.getTokenHistory(address, timeSpan, candleSpan));
  }

  refreshToken(address: string): void {
    this.refreshItem(address);
  }

  refreshTokens(request: TokensFilter): void {
    this.refreshItem(`transactions-request-${request.buildQueryString()}`);
  }

  refreshTokenHistory(address: string, timeSpan: string = "1Y", candleSpan: string = "Hourly"): void {
    this.refreshItem(`${address}-history-${timeSpan}-${candleSpan}`);
  }
}
