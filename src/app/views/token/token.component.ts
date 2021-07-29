import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';
import { switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, Subscription, timer } from 'rxjs';
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
      prefix: '$'
    },
    {
      type: 'candle',
      category: 'OHLC USD',
      prefix: '$'
    }
  ]
  selectedChart = this.chartOptions[0];
  transactionRequest: ITransactionsRequest;
  statCards: StatCardInfo[];

  constructor(
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService
  ) {
    this.tokenAddress = this._route.snapshot.params.token;
  }

  ngOnInit(): void {
    // 10 seconds refresh view
    this.subscription.add(
      timer(0, 10000)
        .pipe(switchMap(() => this.getToken()))
        .pipe(switchMap(() => this.getTokenHistory()))
        .subscribe());
  }

  private getToken(): Observable<any> {
    return this._platformApiService.getToken(this.tokenAddress)
      .pipe(
        take(1),
        tap(token => {
          this.token = token;
          this.transactionRequest = {
            limit: 25,
            eventTypes: this.token.address === 'CRS'
                          ? ['SwapEvent', 'ProvideEvent']
                          : ['TransferEvent', 'ApprovalEvent', 'DistributionEvent', 'SwapEvent', 'ProvideEvent', 'MineEvent'],
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
        formatNumber: 2, 
        show: true,
        helpInfo: {
          title: 'Price Help',
          paragraph: 'This modal is providing help for Price.'
        }
      },
      {
        title: 'Total Supply', 
        value: this.token.totalSupply,
        formatNumber: this.token.decimals,
        daily: true,
        show: true,
        helpInfo: {
          title: 'Total Supply Help',
          paragraph: 'This modal is providing help for Total Supply'
        }
      },
      {
        title: 'Liquidity', 
        value: '1,754,342,353',
        prefix: '$',
        show: true,
        helpInfo: {
          title: 'Liquidity Help',
          paragraph: 'This modal is providing help for Liquidity'
        }
      },
      {
        title: 'Fees', 
        value: '329,199.41',
        prefix: '$',
        show: true,
        helpInfo: {
          title: 'Fees Help',
          paragraph: 'This modal is providing help for Fees'
        }
      }
    ];
  }

  private getTokenHistory(): Observable<any> {
    return this._platformApiService.getTokenHistory(this.tokenAddress)
      .pipe(
        take(1),
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
