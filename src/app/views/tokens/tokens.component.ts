import { tap } from 'rxjs/operators';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Component, OnDestroy } from '@angular/core';
import { TokenOrderByTypes, TokenAttributes, TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { TransactionView } from '@sharedModels/transaction-view';
import { LiquidityPoolsFilter, LpOrderBy } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'opdex-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnDestroy {
  filter: TokensFilter;
  subscription = new Subscription();
  poolsByVolume: ILiquidityPoolResponse[] = [];

  constructor(
    private _sidebar: SidenavService,
    private _indexService: IndexService,
    private _liquidityPoolsService: LiquidityPoolsService)
  {
    // Initialize placeholder skeleton
    this.poolsByVolume = [ null, null, null, null ];

    this.filter = new TokensFilter({
      orderBy: TokenOrderByTypes.DailyPriceChangePercent,
      direction: 'DESC',
      limit: 10,
      tokenAttributes: [TokenAttributes.NonProvisional]
    });

    const volumeFilter = new LiquidityPoolsFilter({orderBy: LpOrderBy.Volume, limit: 4, direction: 'DESC'});

    this.subscription.add(
      this._indexService.getLatestBlock$()
        .pipe(
          switchMap(_ => this._liquidityPoolsService.getLiquidityPools(volumeFilter)),
          tap(pools => this.poolsByVolume = pools.results))
        .subscribe());
  }

  poolsTrackBy(index: number, pool: ILiquidityPoolResponse) {
    if (pool === null || pool === undefined) return index;
    return `${index}-${pool.address}-${pool.summary.cost.crsPerSrc}-${pool.miningPool?.tokensMining}-${pool.summary.staking?.weight}`;
  }

  handleTxOption($event: TransactionView) {
    this._sidebar.openSidenav($event);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
