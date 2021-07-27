import { TokenCache } from './cache/token-cache.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable, race } from 'rxjs';
import { switchMap, tap, skipWhile } from 'rxjs/operators';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';

@Injectable({providedIn: 'root'})
export class TokenService {
  constructor(
    private _platformApi: PlatformApiService,
    private _tokenCache: TokenCache
  ) { }

  getToken(address: string, forceReload: boolean = false): Observable<IToken> {
    const tokenCache$ = this._tokenCache.getToken(address);

    const freshToken$ = this._platformApi.getToken(address)
      .pipe(
        tap(token => this._tokenCache.setToken(token)),
        switchMap(_ => this._tokenCache.getToken(address)));

    // This _works_ but is not quite what we want. This approach will always get when we want to force a reload
    // and also when there is nothing in the cache. The downfall here is for every request, an API request will
    // be made but quickly cancelled when a token is found in the cache.
    //
    // Preferred approach is check cache, get from API if not exists, set cache. The trick is using a single
    // observable so many requests for the same token use a single API call, not one per if the same token
    // is requested 10 times on page load.
    return race(freshToken$, tokenCache$.pipe(skipWhile(token => forceReload || !token.symbol)));
  }

  getTokens() { }

  // Todo: use BigInteger.js to use Math.pow(10, decimals);
  getSats(tokenDecimals: number) {
    if (tokenDecimals === 0) return 1;
    else if (tokenDecimals === 1) return 10;
    else if (tokenDecimals === 2) return 100;
    else if (tokenDecimals === 3) return 1_000;
    else if (tokenDecimals === 4) return 10_000;
    else if (tokenDecimals === 5) return 100_000;
    else if (tokenDecimals === 6) return 1_000_000;
    else if (tokenDecimals === 7) return 10_000_000;
    else if (tokenDecimals === 8) return 100_000_000;
    else if (tokenDecimals === 9) return 1_00_000_000;
    else if (tokenDecimals === 10) return 10_000_000_000;
    else if (tokenDecimals === 11) return 100_000_000_000;
    else if (tokenDecimals === 12) return 1_000_000_000_000;
    else if (tokenDecimals === 13) return 10_000_000_000_000;
    else if (tokenDecimals === 14) return 100_000_000_000_000;
    else if (tokenDecimals === 15) return 1_000_000_000_000_000;
    else if (tokenDecimals === 16) return 10_000_000_000_000_000;
    else if (tokenDecimals === 17) return 100_000_000_000_000_000;
    else return 1_000_000_000_000_000_000;
  }
}
