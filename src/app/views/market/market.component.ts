import { Market } from '@sharedModels/ui/markets/market';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { IMarketHistoryResponse } from '@sharedModels/platform-api/responses/markets/market-history-response.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { MarketHistory } from '@sharedModels/ui/markets/market-history';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { ITransactionsRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { LiquidityPoolsFilter, LpOrderBy, MiningStatus } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { MarketsService } from '@sharedServices/platform/markets.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokenOrderByTypes, TokenAttributes, TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { HistoryFilter, HistoryInterval } from '@sharedModels/platform-api/requests/history-filter';

@Component({
  selector: 'opdex-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit, OnDestroy {
  iconSizes = IconSizes;
  icons = Icons;
  market: Market;
  marketHistory: MarketHistory;
  miningPools$: Observable<LiquidityPool[]>
  transactionsRequest: ITransactionsRequest;
  tokensFilter: TokensFilter;
  liquidityPoolsFilter: LiquidityPoolsFilter;
  miningFilter: LiquidityPoolsFilter;
  historyFilter: HistoryFilter;
  poolsWithEnabledMining: LiquidityPool[];
  chartData: any[];
  chartOptions = [
    {
      type: 'line',
      category: 'Liquidity',
      prefix: '$',
      decimals: 3
    },
    {
      type: 'bar',
      category: 'Volume',
      prefix: '$',
      decimals: 3
    },
    {
      type: 'line',
      category: 'Staking',
      suffix: '',
      decimals: 2
    }
  ];
  selectedChart = this.chartOptions[0];
  subscription = new Subscription();

  constructor(
    private _marketsService: MarketsService,
    private _sidebar: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _indexService: IndexService
  ) { }

  ngOnInit(): void {
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

    this.subscription.add(
      this._indexService.getLatestBlock$()
        .pipe(
          switchMap(_ => this.getMarket()),
          tap(_ => this.historyFilter?.refresh()),
          switchMap(_ => this.getMarketHistory()),
          switchMap(_ => this.getLiquidityPoolsWithMining()))
        .subscribe());
  }

  private getMarket(): Observable<any> {
    return this._marketsService.getMarket()
      .pipe(tap((market: Market) => {
        this.market = market;

        if (!market.isStaking) {
          this.chartOptions = this.chartOptions.filter(option => option.category !== 'Staking');
        } else {
          const index = this.chartOptions.findIndex(option => option.category === 'Staking');
          this.chartOptions[index].suffix = market.tokens.staking.symbol;
        }
      }));
  }

  private getMarketHistory(): Observable<void> {
    if (!this.historyFilter) this.historyFilter = new HistoryFilter();

    return this._marketsService.getMarketHistory(this.historyFilter)
      .pipe(
        delay(10),
        map((marketHistory: IMarketHistoryResponse) => {
          this.marketHistory = new MarketHistory(marketHistory);
          this.handleChartTypeChange(this.selectedChart.category);
        }));
  }

  private getLiquidityPoolsWithMining(): Observable<void> {
    return this._liquidityPoolsService.getLiquidityPools(this.miningFilter)
      .pipe(map(pools => {
        this.poolsWithEnabledMining = pools.results;
        return;
      }));
  }

  handleChartTypeChange($event) {
    this.selectedChart = this.chartOptions.find(options => options.category === $event);

    if ($event === 'Liquidity') {
      this.chartData = this.marketHistory.liquidity;
    }

    if ($event === 'Volume') {
      this.chartData = this.marketHistory.volume;
    }

    if ($event === 'Staking') {
      this.chartData = this.marketHistory.staking;
    }
  }

  handleChartTimeChange(timeSpan: string) {
    let startDate = HistoryFilter.startOfDay(new Date());
    let endDate = HistoryFilter.endOfDay(new Date());

    if (timeSpan === '1M') startDate = HistoryFilter.historicalDate(startDate, 30);
    else if (timeSpan === '1W') startDate = HistoryFilter.historicalDate(startDate, 7);
    else if (timeSpan === '1D') startDate = HistoryFilter.historicalDate(startDate, 1);
    else startDate = HistoryFilter.historicalDate(startDate, 365);

    this.historyFilter = new HistoryFilter(startDate, endDate, HistoryInterval.Daily);

    this.getMarketHistory().pipe(take(1)).subscribe();
  }

  handleTxOption($event: TransactionView) {
    this._sidebar.openSidenav($event);
  }

  createPool() {
    this._sidebar.openSidenav(TransactionView.createPool);
  }

  poolsTrackBy(index: number, pool: LiquidityPool): string {
    return `${index}-${pool?.trackBy}`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
