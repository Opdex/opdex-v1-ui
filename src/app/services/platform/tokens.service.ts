import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
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

  // Todo: use BigInteger.js to use Math.pow(10, decimals); this is not Number type safe
  getSats(tokenDecimals: number): bigint {
    if (tokenDecimals === 0) return BigInt(1);
    else if (tokenDecimals === 1) return BigInt(10);
    else if (tokenDecimals === 2) return BigInt(100);
    else if (tokenDecimals === 3) return BigInt(1_000);
    else if (tokenDecimals === 4) return BigInt(10_000);
    else if (tokenDecimals === 5) return BigInt(100_000);
    else if (tokenDecimals === 6) return BigInt(1_000_000);
    else if (tokenDecimals === 7) return BigInt(10_000_000);
    else if (tokenDecimals === 8) return BigInt(100_000_000);
    else if (tokenDecimals === 9) return BigInt(1_00_000_000);
    else if (tokenDecimals === 10) return BigInt(10_000_000_000);
    else if (tokenDecimals === 11) return BigInt(100_000_000_000);
    else if (tokenDecimals === 12) return BigInt(1_000_000_000_000);
    else if (tokenDecimals === 13) return BigInt(10_000_000_000_000);
    else if (tokenDecimals === 14) return BigInt(100_000_000_000_000);
    else if (tokenDecimals === 15) return BigInt(1_000_000_000_000_000);
    else if (tokenDecimals === 16) return BigInt(10_000_000_000_000_000);
    else if (tokenDecimals === 17) return BigInt(100_000_000_000_000_000);
    else return BigInt(1_000_000_000_000_000_000);
  }
}
