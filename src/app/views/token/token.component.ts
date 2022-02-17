import { MarketToken } from '@sharedModels/ui/tokens/market-token';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { AddressPosition } from '@sharedModels/address-position';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { ILiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TokenHistory } from '@sharedModels/ui/tokens/token-history';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { catchError, map } from 'rxjs/operators';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { ITransactionsRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { delay, switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Icons } from 'src/app/enums/icons';
import { TransactionView } from '@sharedModels/transaction-view';
import { HistoryFilter, HistoryInterval } from '@sharedModels/platform-api/requests/history-filter';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { LiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { UserContext } from '@sharedModels/user-context';

@Component({
  selector: 'opdex-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
  tokenAddress: string;
  token: MarketToken;
  liquidityPool: LiquidityPool;
  balance: AddressPosition;
  subscription = new Subscription();
  tokenHistory: TokenHistory;
  transactionEventTypes = TransactionEventTypes;
  chartData: any[];
  iconSizes = IconSizes;
  icons = Icons;
  chartOptions = [
    {
      type: 'line',
      category: 'Line USD',
      prefix: '$',
      decimals: 3
    },
    {
      type: 'candle',
      category: 'OHLC USD',
      prefix: '$',
      decimals: 3
    }
  ]
  selectedChart = this.chartOptions[1];
  transactionsRequest: ITransactionsRequest;
  routerSubscription = new Subscription();
  historyFilter: HistoryFilter;
  context: UserContext;
  crsPerOlpt: FixedDecimal;
  srcPerOlpt: FixedDecimal;
  isCurrentMarket: boolean;
  one = FixedDecimal.One(0);

  constructor(
    private _route: ActivatedRoute,
    private _tokensService: TokensService,
    private _router: Router,
    private _title: Title,
    private _gaService: GoogleAnalyticsService,
    private _sidebar: SidenavService,
    private _indexService: IndexService,
    private _lpService: LiquidityPoolsService,
    private _walletService: WalletsService,
    private _envService: EnvironmentsService,
    private _userContextService: UserContextService
  ) { }

  ngOnInit(): void {
    this.init();

    this.routerSubscription.add(
      this._router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) return;
        this.init();
      })
    );
  }

  init() {
    this.tokenAddress = this._route.snapshot.params.token;

    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
      this.subscription = new Subscription();
    }

    this.subscription.add(
      this._indexService.getLatestBlock$()
        .pipe(
          switchMap(_ => this._userContextService.getUserContext$().pipe(tap(context => this.context = context))),
          switchMap(_ => this.getToken()),
          tap(_ => this.historyFilter?.refresh()),
          switchMap(_ => this.getTokenHistory()),
          switchMap(_ => this.tryGetLiquidityPool()),
          switchMap(_ => this.tryGetWalletBalance()))
        .subscribe());
  }

  private getToken(): Observable<any> {
    return this._tokensService.getMarketToken(this.tokenAddress)
      .pipe(
        catchError(_ => of(null)),
        tap(token => {
          if (token === null) {
            this._router.navigateByUrl('/tokens');
            return;
          }

          this.token = token;

          this.transactionsRequest = {
            limit: 15,
            eventTypes: this.token.address === 'CRS'
                          ? [this.transactionEventTypes.SwapEvent, this.transactionEventTypes.AddLiquidityEvent, this.transactionEventTypes.RemoveLiquidityEvent]
                          : [this.transactionEventTypes.TransferEvent, this.transactionEventTypes.ApprovalEvent, this.transactionEventTypes.DistributionEvent, this.transactionEventTypes.SwapEvent,
                          this.transactionEventTypes.AddLiquidityEvent, this.transactionEventTypes.RemoveLiquidityEvent, this.transactionEventTypes.StartMiningEvent, this.transactionEventTypes.StopMiningEvent],
            contracts: this.token.address === 'CRS' ? [] : [this.token.address, this.token.liquidityPool],
            direction: 'DESC'
          }

          if (this.token) {
            this._gaService.pageView(this._route.routeConfig.path, `${this.token.symbol} - ${this.token.name}`)
            this._title.setTitle(`${this.token.symbol} - ${this.token.name}`);
          }

          this.isCurrentMarket = this.token.market === this._envService.marketAddress;
        })
      );
  }

  private getTokenHistory(): Observable<any> {
    if (!this.token) return of(null);

    if (!this.historyFilter) this.historyFilter = new HistoryFilter();

    return this._tokensService.getTokenHistory(this.tokenAddress, this.historyFilter)
      .pipe(
        delay(10),
        tap(tokenHistory => {
          this.tokenHistory = new TokenHistory(tokenHistory);
          this.handleChartTypeChange(this.selectedChart.category);
        })
      );
  }

  private tryGetLiquidityPool(): Observable<LiquidityPool> {
    if (!this.token || this.token.address === 'CRS') return of(null);

    if (this.token.symbol === 'OLPT') {
      return this._lpService.getLiquidityPool(this.token.address)
        .pipe(tap(pool => {
          this.liquidityPool = pool;

          const olptSupply = pool.tokens.lp.totalSupply;
          const crsReserves = pool.summary.reserves.crs;
          const srcReserves = pool.summary.reserves.src;

          this.crsPerOlpt = crsReserves.divide(olptSupply);
          this.srcPerOlpt = srcReserves.divide(olptSupply);
        }));
    }

    const filter = new LiquidityPoolsFilter({
      tokens: [this.token.address],
      market: this._envService.marketAddress,
      limit: 1
    } as ILiquidityPoolsFilter);

    return this._lpService.getLiquidityPools(filter)
      .pipe(map(pools => {
        const pool = pools?.results?.length ? pools.results[0] : null;
        this.liquidityPool = pool;
        return pool;
      }));
  }

  private tryGetWalletBalance(): Observable<AddressPosition> {
    if (!!this.context?.wallet === false) return of(null);

    return this._walletService.getBalance(this.context.wallet, this.token.address)
      .pipe(
        catchError(_ => of({balance: '0'})),
        map(balance => {
        const position = new AddressPosition(this.context.wallet, this.token, 'Balance', new FixedDecimal(balance.balance, this.token.decimals));

        this.balance = position;
        return position;
      }));
  }

  handleChartTypeChange($event): void {
    this.selectedChart = this.chartOptions.find(options => options.category === $event);

    if ($event === 'Line USD') this.chartData = this.tokenHistory.line;
    else if ($event === 'OHLC USD') this.chartData = this.tokenHistory.candle;
  }

  handleChartTimeChange(timeSpan: string): void {
    let startDate = HistoryFilter.startOfDay(new Date());
    let endDate = HistoryFilter.endOfDay(new Date());
    let interval = HistoryInterval.Daily;

    if (timeSpan === '1M') {
      startDate = HistoryFilter.historicalDate(startDate, 30);
    } else if (timeSpan === '1W') {
      startDate = HistoryFilter.historicalDate(startDate, 7);
      interval = HistoryInterval.Hourly;
    } else if (timeSpan === '1D') {
      startDate = HistoryFilter.historicalDate(startDate, 1);
      interval = HistoryInterval.Hourly;
    } else {
      startDate = HistoryFilter.historicalDate(startDate, 365);
    }

    this.historyFilter = new HistoryFilter(startDate, endDate, interval);

    this.getTokenHistory().pipe(take(1)).subscribe();
  }

  handleTxOption($event: TransactionView): void {
    this._sidebar.openSidenav($event, {pool: this.liquidityPool});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
