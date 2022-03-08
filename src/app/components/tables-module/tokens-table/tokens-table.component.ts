import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { MarketTokens } from '@sharedModels/ui/tokens/market-tokens';
import { MarketToken } from '@sharedModels/ui/tokens/market-token';
import { Paging } from '@sharedModels/ui/paging';
import { Token } from '@sharedModels/ui/tokens/token';
import { Tokens } from '@sharedModels/ui/tokens/tokens';
import { ITokenHistoryResponse } from '@sharedModels/platform-api/responses/tokens/token-history-response.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Component, Input, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokensFilter } from '@sharedModels/platform-api/requests/tokens/tokens-filter';
import { Observable, forkJoin, Subscription, of } from 'rxjs';
import { switchMap, map, take, tap } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { HistoryFilter, HistoryInterval } from '@sharedModels/platform-api/requests/history-filter';
import { TokenSnapshotHistory } from '@sharedModels/ui/tokens/token-history';
import { TransactionView } from '@sharedModels/transaction-view';

@Component({
  selector: 'opdex-tokens-table',
  templateUrl: './tokens-table.component.html',
  styleUrls: ['./tokens-table.component.scss']
})
export class TokensTableComponent implements OnChanges, OnDestroy {
  @Input() filter: TokensFilter;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  paging: Paging;
  token$: Observable<Tokens>;
  subscription: Subscription;
  icons = Icons;
  iconSizes = IconSizes;
  loading = true;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _router: Router,
    private _tokensService: TokensService,
    private _indexService: IndexService,
    private _sidebar: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['token', 'name', 'nativeChain', 'price', 'history', 'actions'];
  }

  ngOnChanges(): void {
    if (this.filter && !this.subscription) {
      this.loading = true;
      this.subscription = new Subscription();
      this.subscription.add(
        this._indexService.getLatestBlock$()
          .pipe(switchMap(_ => this.getTokens$(this.filter?.cursor)))
          .subscribe(_ => this.loading = false));
    }
  }

  private getTokens$(cursor?: string): Observable<MarketToken[]> {
    this.filter.cursor = cursor;

    return this._tokensService.getTokens(this.filter)
      .pipe(
        switchMap((tokens: MarketTokens) => {
          if (tokens.results.length === 0) {
            return of([]) as Observable<MarketToken[]>;
          }

          this.paging = tokens.paging;
          const tokens$: Observable<MarketToken>[] = [];
          tokens.results.forEach(token => tokens$.push(this.getTokenHistory$(token)));
          return forkJoin(tokens$);
        }),
        tap(tokens => this.dataSource.data = [...tokens]));
  }

  private getTokenHistory$(token: MarketToken): Observable<MarketToken> {
    const startDate = HistoryFilter.historicalDate(HistoryFilter.startOfDay(new Date()), 30);;
    const endDate = HistoryFilter.endOfDay(new Date());
    const historyFilter = new HistoryFilter(startDate, endDate, HistoryInterval.Daily);

    return this._tokensService.getTokenHistory(token.address, historyFilter)
      .pipe(
        take(1),
        map((tokenHistory: ITokenHistoryResponse) => {
          token.setHistory(new TokenSnapshotHistory(token, tokenHistory));
          return token;
        }));
  }

  provide(poolAddress: string): void {
    this._openSidebarWithPool(TransactionView.provide, poolAddress);
  }

  swap(poolAddress: string): void {
    this._openSidebarWithPool(TransactionView.swap, poolAddress);
  }

  pageChange(cursor: string): void {
    this.getTokens$(cursor).pipe(take(1)).subscribe();
  }

  navigate(name: string): void {
    this._router.navigateByUrl(`/tokens/${name}`);
  }

  trackBy(index: number, token: Token): string {
    return `${index}-${token?.trackBy}`;
  }

  private _openSidebarWithPool(txView: TransactionView, address: string): void {
    this._liquidityPoolsService.getLiquidityPool(address)
      .pipe(take(1))
      .subscribe(pool => this._sidebar.openSidenav(txView, { pool }));
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
