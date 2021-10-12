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
}
