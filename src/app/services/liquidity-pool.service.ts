import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from './cache.service';

@Injectable({providedIn: 'root'})
export class LiquidityPoolService extends CacheService {

  constructor(private _platformApi: PlatformApiService) {
    super();
  }

  getLiquidityPool(address: string): Observable<ILiquidityPoolSummaryResponse> {
    return this.getItem(address, this._platformApi.getPool(address));
  }

  refreshPool(address: string): void {
    this.refreshItem(address);
  }

  getPools() { }
}
