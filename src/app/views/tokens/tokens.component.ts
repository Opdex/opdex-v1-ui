import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Component } from '@angular/core';
import { TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { TransactionView } from '@sharedModels/transaction-view';
import { LiquidityPoolsFilter, LpOrderBy } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {
  filter: TokensFilter;
  poolsByVolume$: Observable<ILiquidityPoolSummary[]>;

  constructor(
    private _sidebar: SidenavService,
    private _blocksService: BlocksService,
    private _liquidityPoolsService: LiquidityPoolsService)
  {
    this.filter = new TokensFilter({
      orderBy: 'DailyPriceChangePercent',
      direction: 'DESC',
      limit: 10,
      provisional: 'NonProvisional'
    });

    const volumeFilter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Volume, limit: 4, direction: 'DESC'});
    this.poolsByVolume$ =
      this._blocksService.getLatestBlock$()
        .pipe(
          switchMap(_ => this._liquidityPoolsService.getLiquidityPools(volumeFilter)),
          map(pools => pools.results)
        );
  }

  poolsTrackBy(index: number, pool: ILiquidityPoolSummary) {
    return `${index}-${pool.address}-${pool.cost.crsPerSrc.close}-${pool.mining?.tokensMining}-${pool.staking?.weight}`;
  }

  handleTxOption($event: TransactionView) {
    this._sidebar.openSidenav($event);
  }
}
