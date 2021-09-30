import { ILiquidityPoolSummary, ILiquidityPoolSnapshotHistory } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from '../utility/cache.service';

@Injectable({providedIn: 'root'})
export class LiquidityPoolsService extends CacheService {

  constructor(private _platformApi: PlatformApiService) {
    super();
  }

  getLiquidityPool(address: string): Observable<ILiquidityPoolSummary> {
    return this.getItem(address, this._platformApi.getPool(address));
  }

  getLiquidityPoolHistory(address: string, timeSpan: string = '1Y'): Observable<ILiquidityPoolSnapshotHistory> {
    return this.getItem(`${address}-history-${timeSpan}`, this._platformApi.getPoolHistory(address, timeSpan));
  }

  refreshPool(address: string): void {
    this.refreshItem(address);
  }

  refreshPoolHistory(address: string, timeSpan: string = '1Y'): void {
    this.refreshItem(`${address}-history-${timeSpan}`);
  }

  getPools() { }
}
