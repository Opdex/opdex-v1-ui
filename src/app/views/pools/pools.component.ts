import { ILiquidityPoolsResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pools-response.interface';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Component, OnInit } from '@angular/core';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { LiquidityPoolsFilter, LpOrderBy, MiningFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';

interface IPoolsView {
  topVolume: ILiquidityPoolsResponse,
  mining: ILiquidityPoolsResponse
}
@Component({
  selector: 'opdex-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  pools$: Observable<IPoolsView>;
  topPoolsFilter: LiquidityPoolsFilter;

  constructor(
    private _sidebar: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _blocksService: BlocksService
  ) {
    this.topPoolsFilter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Liquidity, limit: 10, direction: 'DESC'});
  }

  ngOnInit(): void {
    const miningFilter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Liquidity, limit: 4, direction: 'DESC', miningFilter: MiningFilter.Enabled});
    const volumeFilter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Volume, limit: 4, direction: 'DESC'});

    this.pools$ = this._blocksService.getLatestBlock$()
      .pipe(switchMap(_ => {
        return combineLatest([
          this._liquidityPoolsService.getLiquidityPools(volumeFilter),
          this._liquidityPoolsService.getLiquidityPools(miningFilter)
        ]).pipe(map((summaries: ILiquidityPoolsResponse[]) => {
          return {
            topVolume: summaries[0],
            mining: summaries[1]
          }
        }));
      }));
  }

  createPool() {
    this._sidebar.openSidenav(TransactionView.createPool);
  }
}
