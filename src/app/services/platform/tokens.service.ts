import { HistoryFilter } from '@sharedModels/platform-api/requests/history-filter';
import { ITokensResponse } from '@sharedModels/platform-api/responses/tokens/tokens-response.interface';
import { IMarketToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { CacheService } from '../utility/cache.service';
import { TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { ITokenHistoryResponse } from '@sharedModels/platform-api/responses/tokens/token-history-response.interface';

@Injectable({providedIn: 'root'})
export class TokensService extends CacheService {

  constructor(private _platformApi: PlatformApiService, protected _injector: Injector) {
    super(_injector);
  }

  getToken(address: string, cacheOnly?: boolean): Observable<IToken> {
    return this.getItem(`token-${address}`, this._platformApi.getToken(address), cacheOnly)
  }

  getMarketToken(address: string, cacheOnly?: boolean): Observable<IToken | IMarketToken> {
    return address === 'CRS'
      ? this.getToken(address, cacheOnly)
      : this.getItem(`market-token-${address}`, this._platformApi.getMarketToken(address), cacheOnly);
  }

  getTokens(request: TokensFilter): Observable<ITokensResponse> {
    return this.getItem(`tokens-request-${request.buildQueryString()}`, this._platformApi.getMarketTokens(request));
  }

  getTokenHistory(address: string, filter: HistoryFilter): Observable<ITokenHistoryResponse> {
    const key = `${address}-history-${filter.buildQueryString()}`;

    return address === 'CRS'
      ? this.getItem(key, this._platformApi.getTokenHistory(address, filter))
      : this.getItem(key, this._platformApi.getMarketTokenHistory(address, filter));
  }

  refreshToken(address: string): void {
    this.refreshItem(address);
  }

  refreshTokens(request: TokensFilter): void {
    this.refreshItem(`tokens-request-${request.buildQueryString()}`);
  }

  refreshTokenHistory(address: string, filter: HistoryFilter): void {
    this.refreshItem(`${address}-history-${filter.buildQueryString()}`);
  }
}
