import { HistoryFilter } from '@sharedModels/platform-api/requests/history-filter';
import { ILiquidityPoolsResponse, ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from '../utility/cache.service';
import { LiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { ILiquidityPoolSnapshotHistoryResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-snapshots-responses.interface';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class LiquidityPoolsService extends CacheService {

  constructor(private _platformApi: PlatformApiService, private _env: EnvironmentsService, protected _injector: Injector) {
    super(_injector);
  }

  getLiquidityPool(address: string, cacheOnly?: boolean): Observable<ILiquidityPoolResponse> {
    return this.getItem(address, this._platformApi.getPool(address), cacheOnly);
  }

  getLiquidityPoolHistory(address: string, request: HistoryFilter): Observable<ILiquidityPoolSnapshotHistoryResponse> {
    return this.getItem(`${address}-history-${request.buildQueryString()}`, this._platformApi.getLiquidityPoolHistory(address, request));
  }

  getLiquidityPools(request: LiquidityPoolsFilter): Observable<ILiquidityPoolsResponse> {
    const market = this._env.marketAddress;

    if (request.markets.find(m => m === market) === undefined) {
      request.markets.push(market);
    }

    return this.getItem(`liquidity-pools-${request.buildQueryString()}`, this._platformApi.getLiquidityPools(request))
      .pipe(tap(pools => pools.results.forEach(pool => this.cacheItem(pool.address, pool))));
  }
}
