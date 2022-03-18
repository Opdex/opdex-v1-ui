import { LiquidityPools } from '@sharedModels/ui/liquidity-pools/liquidity-pools';
import { Market } from '@sharedModels/ui/markets/market';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { IMarketHistoryResponse } from '@sharedModels/platform-api/responses/markets/market-history-response.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { MarketSnapshotHistory } from '@sharedModels/ui/markets/market-history';
import { Icons } from 'src/app/enums/icons';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { LiquidityPoolsFilter, LpOrderBy, MiningStatus } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { MarketsService } from '@sharedServices/platform/markets.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokenOrderByTypes, TokenAttributes, TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { HistoryFilter } from '@sharedModels/platform-api/requests/history-filter';

@Component({
  selector: 'opdex-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit, OnDestroy {
  market: Market;
  tokensFilter: TokensFilter;
  liquidityPoolsFilter: LiquidityPoolsFilter;
  miningFilter: LiquidityPoolsFilter;
  historyFilter: HistoryFilter;
  poolsWithEnabledMining: LiquidityPool[];
  chartsHistory: MarketSnapshotHistory;
  subscription = new Subscription();
  icons = Icons;

  constructor(
    private _marketsService: MarketsService,
    private _sidebar: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _indexService: IndexService
  ) {
    this.tokensFilter = new TokensFilter({
      orderBy: TokenOrderByTypes.DailyPriceChangePercent,
      direction: 'DESC',
      limit: 5,
      tokenAttributes: [TokenAttributes.NonProvisional]
    });

    this.liquidityPoolsFilter = new LiquidityPoolsFilter({
      orderBy: LpOrderBy.Liquidity,
      direction: 'DESC',
      limit: 5
    });

    this.miningFilter = new LiquidityPoolsFilter({
      orderBy: LpOrderBy.Liquidity,
      limit: 4,
      direction: 'DESC',
      miningStatus: MiningStatus.Enabled
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this._indexService.latestBlock$
        .pipe(
          switchMap(_ => this._getMarket()),
          tap(_ => this.historyFilter?.refresh()),
          switchMap(_ => this._getMarketHistory()),
          switchMap(_ => this._getLiquidityPoolsWithMining()))
        .subscribe());
  }

  handleTxOption($event: TransactionView): void {
    this._sidebar.openSidenav($event);
  }

  poolsTrackBy(index: number, pool: LiquidityPool): string {
    return `${index}-${pool?.trackBy}`;
  }

  private _getMarket(): Observable<Market> {
    return this._marketsService.getMarket()
      .pipe(tap((market: Market) => this.market = market));
  }

  private _getMarketHistory(): Observable<IMarketHistoryResponse> {
    if (!this.historyFilter) this.historyFilter = new HistoryFilter();

    return this._marketsService.getMarketHistory(this.historyFilter)
      .pipe(
        delay(10),
        tap((marketHistory: IMarketHistoryResponse) =>
          this.chartsHistory = new MarketSnapshotHistory(this.market, marketHistory)));
  }

  private _getLiquidityPoolsWithMining(): Observable<LiquidityPools> {
    return this._liquidityPoolsService.getLiquidityPools(this.miningFilter)
      .pipe(tap(pools => this.poolsWithEnabledMining = pools.results));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
