import { BlocksService } from '@sharedServices/platform/blocks.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Component, Input, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { ITokensResponse } from '@sharedModels/platform-api/responses/tokens/tokens-response.interface';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';

@Component({
  selector: 'opdex-tokens-table',
  templateUrl: './tokens-table.component.html',
  styleUrls: ['./tokens-table.component.scss']
})
export class TokensTableComponent implements OnChanges, OnDestroy {
  @Input() filter: TokensFilter;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  paging: ICursor;
  token$: Observable<ITokensResponse>;
  subscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _router: Router, private _tokensService: TokensService, private _blocksService: BlocksService) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['token', 'name', 'price'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.subscription = new Subscription();
      this.subscription.add(
        this._blocksService.getLatestBlock$()
          .pipe(switchMap(_ => this.getTokens$()))
          .subscribe())
    }
  }

  private getTokens$(cursor?: string): Observable<ITokensResponse> {
    this.filter.cursor = cursor;

    return this._tokensService.getTokens(this.filter)
      .pipe(
        switchMap((tokens: ITokensResponse) => {
          this.paging = tokens.paging;
          const poolArray$: Observable<any>[] = [];
          tokens.results.forEach(token => poolArray$.push(this.getTokenHistory$(token)));
          return forkJoin(poolArray$);
        }),
        map(tokens => {
          this.dataSource.data = [...tokens.map(t => {
            return {
              name: t.name,
              symbol: t.symbol,
              price: t.summary?.priceUsd,
              change: t.summary?.dailyPriceChangePercent || 0,
              address: t.address,
              price7d: t.snapshotHistory
            }
          })];

          return {results: tokens, paging: this.paging}
        }),
        take(1)
      );
  }

  private getTokenHistory$(token: any): Observable<any> {
    return this._tokensService.getTokenHistory(token.address, "1W")
      .pipe(
        take(1),
        map((tokenHistory: any) => {
          let priceHistory: any[] = [];

          tokenHistory.snapshotHistory.forEach(history => {
            priceHistory.push({
              time: Date.parse(history.startDate.toString())/1000,
              value: history.price.close
            });
          });

          token.snapshotHistory = priceHistory;
          return token;
        }));
  }

  pageChange(cursor: string) {
    this.getTokens$(cursor).pipe(take(1)).subscribe();
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/tokens/${name}`);
  }

  trackBy(index: number, token: any) {
    return token.address
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
