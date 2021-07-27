import { Injectable } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class LiquidityPoolCache {
  private cache: Record<string, BehaviorSubject<ILiquidityPoolSummaryResponse>> = {};


  getLiquidityPool(address: string): Observable<ILiquidityPoolSummaryResponse> {
    if (!this.cache[address]) {
      this.setLiquidityPool({address} as ILiquidityPoolSummaryResponse);
    }

    return this.cache[address];
  }

  setLiquidityPool(pool: ILiquidityPoolSummaryResponse): void {
    if (this.cache[pool.address]) {
      this.cache[pool.address].next(pool);
    } else {
      this.cache[pool.address] = new BehaviorSubject(pool);
    }
  }
}

