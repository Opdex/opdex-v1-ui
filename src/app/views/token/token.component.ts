import { catchError } from 'rxjs/operators';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';
import { delay, switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, Subscription, interval, of } from 'rxjs';
import { StatCardInfo } from '@sharedComponents/cards-module/stat-card/stat-card-info';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'opdex-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
  ohlcPoints = [];
  tokenAddress: string;
  token: any;
  subscription = new Subscription();
  tokenHistory: any;
  priceHistory: any[] = [];
  candleHistory: any[] = [];
  chartData: any[];
  chartOptions = [
    {
      type: 'line',
      category: 'USD Price',
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
  transactionRequest: ITransactionsRequest;
  statCards: StatCardInfo[];
  routerSubscription = new Subscription();


  constructor(
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService,
    private _tokensService: TokensService,
    private _router: Router,
    private _title: Title
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

    this.subscription.add(interval(30000)
      .pipe(tap(_ => {
        this._tokensService.refreshToken(this.tokenAddress);
        this._tokensService.refreshTokenHistory(this.tokenAddress);
      }))
      .subscribe());

    this.subscription.add(this.getToken()
      .pipe(switchMap(() => this.getTokenHistory()))
      .subscribe());
  }

  private getToken(): Observable<any> {
    return this._tokensService.getToken(this.tokenAddress)
      .pipe(
        catchError(_ => of(null)),
        tap(token => {
          if (token === null) {
            this._router.navigateByUrl('/not-found');
            return;
          }

          this.token = token;
          this.transactionRequest = {
            limit: 5,
            eventTypes: this.token.address === 'CRS'
                          ? ['SwapEvent', 'AddLiquidityEvent', 'RemoveLiquidityEvent']
                          : ['TransferEvent', 'ApprovalEvent', 'DistributionEvent', 'SwapEvent', 'AddLiquidityEvent', 'RemoveLiquidityEvent', 'StartMiningEvent', 'StopMiningEvent'],
            contracts: this.token.address === 'CRS'
                          ? []
                          : [this.token.address],
            direction: 'DESC'
          }
          if (this.token){
            this._title.setTitle(`${this.token.symbol} - ${this.token.name}`);
            this.setTokenStatCards();
          }
        })
      );
  }

  private setTokenStatCards(): void {
    this.statCards = [
      {
        title: 'Price',
        value: this.token.summary.price.close,
        change: this.token.summary.dailyPriceChange,
        prefix: '$',
        show: true,
        helpInfo: {
          title: 'Price',
          paragraph: 'This indicator provides the latest known USD price of the token. USD prices are computed using Cirrus (CRS) USD price and the liquidity pool reserve ratio between the displayed token and its liquidity pool reserves.'
        }
      },
      {
        title: 'Total Supply',
        value: this.token.totalSupply,
        daily: false,
        show: true,
        helpInfo: {
          title: 'Total Supply',
          paragraph: 'This indicator is the latest known total supply value of the token. The total supply is how many tokens are in circulation and exist in contract.'
        }
      }
    ];
  }

  private getTokenHistory(timeSpan: string = '1Y'): Observable<any> {
    if (!this.token) return of(null);

    return this._tokensService.getTokenHistory(this.tokenAddress, timeSpan)
      .pipe(
        take(1),
        delay(10),
        tap(tokenHistory => {
          this.tokenHistory = tokenHistory;

          let priceHistory = [];
          let candleHistory = [];

          this.tokenHistory.snapshotHistory.forEach(history => {
            priceHistory.push({
              time: Date.parse(history.startDate.toString())/1000,
              value: history.price.close
            });

            candleHistory.push({
              time: Date.parse(history.startDate.toString())/1000,
              open: history.price.open,
              high: history.price.high,
              low: history.price.low,
              close: history.price.close,
            });
          });

          this.priceHistory = priceHistory;
          this.candleHistory = candleHistory;


          this.handleChartTypeChange(this.selectedChart.category);
        })
      );
  }

  handleChartTypeChange($event) {
    this.selectedChart = this.chartOptions.find(options => options.category === $event);

    if ($event === 'USD Price') {
      this.chartData = this.priceHistory;
    } else if ($event === 'OHLC USD') {
      this.chartData = this.candleHistory;
    }
  }

  handleChartTimeChange($event: string) {
    this.getTokenHistory($event).pipe(take(1)).subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
