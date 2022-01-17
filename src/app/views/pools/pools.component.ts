import { IndexService } from '@sharedServices/platform/index.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { Icons } from 'src/app/enums/icons';
import { LiquidityPoolsFilter, LpOrderBy, MiningFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { ILiquidityPoolsResponse, ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';

interface IPoolsView {
  topVolume: ILiquidityPoolsResponse,
  mining: ILiquidityPoolsResponse
}
@Component({
  selector: 'opdex-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit, OnDestroy {
  pools: IPoolsView;
  icons = Icons;
  topPoolsFilter: LiquidityPoolsFilter;
  subscription = new Subscription();

  constructor(
    private _sidebar: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _indexService: IndexService
  ) {
    this.topPoolsFilter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Liquidity, limit: 10, direction: 'DESC'});

    // Initialize dummy results for skeleton placeholders
    this.pools = {
      topVolume: {
        results: [null, null, null, null],
        paging: null
      },
      mining: null
    }
  }

  ngOnInit(): void {
    const miningFilter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Liquidity, limit: 4, direction: 'DESC', miningFilter: MiningFilter.Enabled});
    const volumeFilter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Volume, limit: 4, direction: 'DESC'});

    this.subscription.add(this._indexService.getLatestBlock$()
      .pipe(switchMap(_ => {
        return combineLatest([
          this._liquidityPoolsService.getLiquidityPools(volumeFilter),
          this._liquidityPoolsService.getLiquidityPools(miningFilter)
        ]).pipe(map((summaries: ILiquidityPoolsResponse[]) => {
          this.pools = {
            topVolume: summaries[0],
            mining: summaries[1]
          }
        }));
      })).subscribe());
  }

  handleTxOption($event: TransactionView) {
    this._sidebar.openSidenav($event);
  }

  createPool() {
    this._sidebar.openSidenav(TransactionView.createPool);
  }

  poolsTrackBy(index: number, pool: ILiquidityPoolResponse) {
    if (pool === null || pool === undefined) return index;
    return `${index}-${pool.address}-${pool.summary.cost.crsPerSrc}-${pool.miningPool?.tokensMining}-${pool.summary.staking?.weight}`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
