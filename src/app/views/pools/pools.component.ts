import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Component, OnInit } from '@angular/core';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { map, switchMap } from 'rxjs/operators';
import { LiquidityPoolsSearchQuery } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { combineLatest, Observable } from 'rxjs';
import { Icons } from 'src/app/enums/icons';

interface IPoolsView {
  topVolume: ILiquidityPoolSummary[],
  mining: ILiquidityPoolSummary[],
  byLiquidity: ILiquidityPoolSummary[],
}
@Component({
  selector: 'opdex-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  pools$: Observable<IPoolsView>;
  icons = Icons;

  constructor(
    private _sidebar: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _blocksService: BlocksService
  ) { }

  ngOnInit(): void {
    this.pools$ = this._blocksService.getLatestBlock$()
      .pipe(switchMap(_ => {
        return combineLatest([
          this._liquidityPoolsService.getLiquidityPools(new LiquidityPoolsSearchQuery('Volume', 'DESC', 0, 4)),
          this._liquidityPoolsService.getLiquidityPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {mining: true})),
          this._liquidityPoolsService.getLiquidityPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 10))
        ]).pipe(map((summaries: ILiquidityPoolSummary[][]) => {
          return {
            topVolume: summaries[0],
            mining: summaries[1],
            byLiquidity: summaries[2]
          }
        }));
      }));
  }

  createPool() {
    this._sidebar.openSidenav(TransactionView.createPool);
  }
}
