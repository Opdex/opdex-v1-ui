import { MarketTokens } from '@sharedModels/ui/tokens/market-tokens';
import { MarketToken } from '@sharedModels/ui/tokens/market-token';
import { HistoryFilter } from '@sharedModels/platform-api/requests/history-filter';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from '../utility/cache.service';
import { TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { ITokenHistoryResponse } from '@sharedModels/platform-api/responses/tokens/token-history-response.interface';
import { tap } from 'rxjs/operators';
import { Token } from '@sharedModels/ui/tokens/token';

@Injectable({providedIn: 'root'})
export class TokensService extends CacheService {

  constructor(private _platformApi: PlatformApiService, protected _injector: Injector) {
    super(_injector);
  }

  getToken(address: string): Observable<Token> {
    return this.getItem(`token-${address}`, this._platformApi.getToken(address))
  }

  getMarketToken(address: string): Observable<Token | MarketToken> {
    return address === 'CRS'
      ? this.getToken(address)
      : this.getItem(`market-token-${address}`, this._platformApi.getMarketToken(address));
  }

  getTokens(request: TokensFilter): Observable<MarketTokens> {
    return this.getItem(`tokens-${request.buildQueryString()}`, this._platformApi.getMarketTokens(request))
      .pipe(tap(tokens => tokens.results.forEach(token => this.cacheItem(`market-token-${token.address}`, token))));
  }

  getTokenHistory(address: string, filter: HistoryFilter): Observable<ITokenHistoryResponse> {
    const key = `${address}-history-${filter.buildQueryString()}`;

    return address === 'CRS'
      ? this.getItem(key, this._platformApi.getTokenHistory(address, filter))
      : this.getItem(key, this._platformApi.getMarketTokenHistory(address, filter));
  }
}
