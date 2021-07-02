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
      .pipe(take(1), tap(token => this.token = token));
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
        })
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
