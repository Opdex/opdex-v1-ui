import { ILiquidityPoolSnapshotHistoryResponse, ILiquidityPoolSummaryResponse } from './../../models/responses/platform-api/Pools/liquidity-pool.interface';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { forkJoin, Observable } from 'rxjs';
import { LiquidityPoolsSearchQuery } from '@sharedModels/liquidity-pool-filter';

@Component({
  selector: 'opdex-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  pools$: Observable<ILiquidityPoolSummaryResponse[]>;
  poolsByVolume$: Observable<ILiquidityPoolSummaryResponse[]>;
  poolsMining$: Observable<ILiquidityPoolSummaryResponse[]>;

  constructor(private _platformApiService: PlatformApiService) { }

  ngOnInit(): void {
    this.poolsByVolume$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Volume', 'DESC', 0, 4));
    this.poolsMining$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {mining: true}));
    this.pools$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 100));
  }
}
