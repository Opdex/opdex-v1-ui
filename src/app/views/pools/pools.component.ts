import { ILiquidityPoolSnapshotHistoryResponse, ILiquidityPoolSummaryResponse } from './../../models/responses/platform-api/Pools/liquidity-pool.interface';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'opdex-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  pools: ILiquidityPoolSummaryResponse[];
  poolsByVolume: ILiquidityPoolSummaryResponse[];

  constructor(private _platformApiService: PlatformApiService) { }

  ngOnInit(): void {
    this._platformApiService.getPools()
      .pipe(
        take(1),
        tap(pools => {
          this.poolsByVolume = pools.sort((a, b) => b.volume.usd - a.volume.usd);
        }),
        switchMap((pools: ILiquidityPoolSummaryResponse[]) => {
          const poolArray$: Observable<ILiquidityPoolSummaryResponse>[] = [];

          pools.forEach(pool => {
            const pool$: Observable<any> = this.getPoolHistory(pool);
            poolArray$.push(pool$);
          });

          return forkJoin(poolArray$);
        })
      )
      .subscribe(pools => this.pools = pools);
  }

  private getPoolHistory(pool: ILiquidityPoolSummaryResponse): Observable<ILiquidityPoolSummaryResponse> {
    return this._platformApiService.getPoolHistory(pool.address)
      .pipe(
        take(1),
        map((poolHistory: ILiquidityPoolSnapshotHistoryResponse) => {
          let liquidityPoints: any[] = [];

          poolHistory.snapshotHistory.forEach(history => {
            liquidityPoints.push({
              time: Date.parse(history.startDate.toString())/1000,
              value: history.reserves.usd
            });
          });

          pool.snapshotHistory = liquidityPoints;

          return pool;
        }));
  }
}
