import { IndexService } from '@sharedServices/platform/index.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TokenHistory } from '@sharedModels/token-history';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { catchError } from 'rxjs/operators';
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

@Component({
  selector: 'opdex-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
  tokenAddress: string;
  token: any;
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
  selectedChart = this.chartOptions[0];
  transactionsRequest: ITransactionsRequest;
  routerSubscription = new Subscription();
  historyFilter: HistoryFilter;

  constructor(
    private _route: ActivatedRoute,
    private _tokensService: TokensService,
    private _router: Router,
    private _title: Title,
    private _gaService: GoogleAnalyticsService,
    private _sidebar: SidenavService,
    private _indexService: IndexService
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
          switchMap(_ => this.getToken()),
          tap(_ => this.historyFilter?.refresh()),
          switchMap(_ => this.getTokenHistory()))
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
    this._sidebar.openSidenav($event);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
