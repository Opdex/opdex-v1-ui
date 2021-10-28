import { IconSizes } from 'src/app/enums/icon-sizes';
import { catchError } from 'rxjs/operators';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { ITransactionsRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { delay, switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription, interval, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Icons } from 'src/app/enums/icons';

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
  iconSizes = IconSizes;
  icons = Icons;
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
  routerSubscription = new Subscription();


  constructor(
    private _route: ActivatedRoute,
    private _tokensService: TokensService,
    private _router: Router,
    private _title: Title,
    private _gaService: GoogleAnalyticsService
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
            limit: 15,
            eventTypes: this.token.address === 'CRS'
                          ? ['SwapEvent', 'AddLiquidityEvent', 'RemoveLiquidityEvent']
                          : ['TransferEvent', 'ApprovalEvent', 'DistributionEvent', 'SwapEvent', 'AddLiquidityEvent', 'RemoveLiquidityEvent', 'StartMiningEvent', 'StopMiningEvent'],
            contracts: this.token.address === 'CRS'
                          ? []
                          : [this.token.address],
            direction: 'DESC'
          }
          if (this.token){
            this._gaService.pageView(this._route.routeConfig.path, `${this.token.symbol} - ${this.token.name}`)
            this._title.setTitle(`${this.token.symbol} - ${this.token.name}`);
          }
        })
      );
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

          // Temporary fix for CRS pricing coming back as 0
          const tokenPrice = new FixedDecimal(this.token.summary.priceUsd, this.token.decimals);
          if (tokenPrice.isZero) {
            this.token.summary.priceUsd = priceHistory[priceHistory.length - 1].value;
          }

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
