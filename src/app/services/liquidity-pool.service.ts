import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { Observable, race } from 'rxjs';
import { tap, switchMap, skipWhile } from 'rxjs/operators';
import { LiquidityPoolCache } from './cache/liquidity-pool-cache.service';

@Injectable()
export class LiquidityPoolService {
  cache$: Observable<Record<string, ILiquidityPoolSummaryResponse>>;

  constructor(
    private _platformApi: PlatformApiService,
    private _liquidityPoolCache: LiquidityPoolCache
  ) { }

  getLiquidityPool(address: string, forceReload: boolean = false): Observable<ILiquidityPoolSummaryResponse> {
    const poolCache$ = this._liquidityPoolCache.getLiquidityPool(address);

    const freshPool$ = this._platformApi.getPool(address)
      .pipe(
        tap(pool => this._liquidityPoolCache.setLiquidityPool(pool)),
        switchMap(_ => this._liquidityPoolCache.getLiquidityPool(address)));

    return race(freshPool$, poolCache$.pipe(skipWhile(pool => forceReload || !pool.token)));
  }

  getPools() { }
}
