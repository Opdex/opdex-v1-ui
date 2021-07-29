import { TokensService } from '@sharedServices/platform/tokens.service';
import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';
import { delay, switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, Subscription, interval } from 'rxjs';

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
                          ? ['SwapEvent', 'ProvideEvent']
                          : ['TransferEvent', 'ApprovalEvent', 'DistributionEvent', 'SwapEvent', 'ProvideEvent', 'MineEvent'],
            contracts: this.token.address === 'CRS'
                          ? []
                          : [this.token.address],
            direction: 'DESC'
          }
        })
      );
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
