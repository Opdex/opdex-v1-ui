import { ILiquidityPoolSummaryResponse, ILiquidityPoolSnapshotHistoryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from '../utility/cache.service';

@Injectable({providedIn: 'root'})
export class LiquidityPoolsService extends CacheService {

  constructor(private _platformApi: PlatformApiService) {
    super();
  }

  getLiquidityPool(address: string): Observable<ILiquidityPoolSummaryResponse> {
    return this.getItem(address, this._platformApi.getPool(address));
  }

  getLiquidityPoolHistory(address: string): Observable<ILiquidityPoolSnapshotHistoryResponse> {
    return this.getItem(`${address}-history`, this._platformApi.getPoolHistory(address));
  }

  refreshPool(address: string): void {
    this.refreshItem(address);
  }

  refreshPoolHistory(address: string): void {
    this.refreshItem(`${address}-history`);
  }

  getPools() { }
}
