import { TokensService } from '@sharedServices/platform/tokens.service';
import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';
import { delay, switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, Subscription, interval } from 'rxjs';
import { StatCardInfo } from '@sharedComponents/cards-module/stat-card/stat-card-info';

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

  constructor(
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService,
    private _tokensService: TokensService,
  ) {
    this.tokenAddress = this._route.snapshot.params.token;
  }

  ngOnInit(): void {
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
        tap(token => {
          this.token = token;
          this.transactionRequest = {
            limit: 25,
            eventTypes: this.token.address === 'CRS'
                          ? ['SwapEvent', 'AddLiquidityEvent', 'RemoveLiquidityEvent']
                          : ['TransferEvent', 'ApprovalEvent', 'DistributionEvent', 'SwapEvent', 'AddLiquidityEvent', 'RemoveLiquidityEvent', 'StartMiningEvent', 'StopMiningEvent'],
            contracts: this.token.address === 'CRS'
                          ? []
                          : [this.token.address],
            direction: 'DESC'
          }
          if (this.token){
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
          title: 'Price Help',
          paragraph: 'This modal is providing help for Price.'
        }
      },
      {
        title: 'Total Supply',
        value: this.token.totalSupply,
        daily: true,
        show: true,
        helpInfo: {
          title: 'Total Supply Help',
          paragraph: 'This modal is providing help for Total Supply'
        }
      }
    ];
  }

  private getTokenHistory(): Observable<any> {
    return this._tokensService.getTokenHistory(this.tokenAddress)
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
