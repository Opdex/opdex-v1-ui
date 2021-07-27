import { TokenService } from '@sharedServices/token.service';
import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';
import { switchMap, take, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, Subscription, timer } from 'rxjs';

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
  chartData: any[];
  chartOptions = [
    {
      type: 'line',
      category: 'USD Price',
      prefix: '$'
    }
  ]
  selectedChart = this.chartOptions[0];
  transactionRequest: ITransactionsRequest;

  constructor(
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService,
    private _tokenService: TokenService,
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
    return this._tokenService.getToken(this.tokenAddress, true)
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
    return this._platformApiService.getTokenHistory(this.tokenAddress)
      .pipe(
        take(1),
        tap(tokenHistory => {
          this.tokenHistory = tokenHistory;

          let priceHistory = [];

          this.tokenHistory.snapshotHistory.forEach(history => {
            priceHistory.push({
              time: Date.parse(history.startDate.toString())/1000,
              value: history.price.close
            });
          });

          this.priceHistory = priceHistory;

          this.handleChartTypeChange(this.selectedChart.category);
        })
      );
  }

  handleChartTypeChange($event) {
    this.selectedChart = this.chartOptions.find(options => options.category === $event);

    if ($event === 'USD Price') {
      this.chartData = this.priceHistory;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
