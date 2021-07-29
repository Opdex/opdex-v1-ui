import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';
import { CacheService } from '../utility/cache.service';

@Injectable({providedIn: 'root'})
export class TokensService extends CacheService {

  constructor(private _platformApi: PlatformApiService) {
    super();
  }

  getToken(address: string): Observable<IToken> {
    return this.getItem(address, this._platformApi.getToken(address));
  }

  getTokenHistory(address: string, timeSpan: string = "1Y", candleSpan: string = "Hourly"): Observable<any> {
    return this.getItem(`${address}-history-${timeSpan}-${candleSpan}`, this._platformApi.getTokenHistory(address, timeSpan, candleSpan));
  }

  refreshToken(address: string): void {
    this.refreshItem(address);
  }

  refreshTokenHistory(address: string, timeSpan: string = "1Y", candleSpan: string = "Hourly"): void {
    this.refreshItem(`${address}-history-${timeSpan}-${candleSpan}`);
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
