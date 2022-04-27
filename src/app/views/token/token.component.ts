import { TokenSnapshotHistory } from '@sharedModels/ui/tokens/token-history';
import { MarketToken } from '@sharedModels/ui/tokens/market-token';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { AddressPosition } from '@sharedModels/address-position';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { ILiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { catchError, map } from 'rxjs/operators';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { ITransactionsRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Icons } from 'src/app/enums/icons';
import { TransactionView } from '@sharedModels/transaction-view';
import { HistoryFilter } from '@sharedModels/platform-api/requests/history-filter';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { LiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { UserContext } from '@sharedModels/user-context';

@Component({
  selector: 'opdex-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent implements OnInit {
  tokenAddress: string;
  token: MarketToken;
  liquidityPool: LiquidityPool;
  balance: AddressPosition;
  subscription = new Subscription();
  transactionEventTypes = TransactionEventTypes;
  icons = Icons;
  chartsHistory: TokenSnapshotHistory;
  transactionsRequest: ITransactionsRequest;
  routerSubscription = new Subscription();
  historyFilter: HistoryFilter;
  context: UserContext;
  crsPerOlpt: FixedDecimal;
  srcPerOlpt: FixedDecimal;
  isCurrentMarket: boolean;
  one = FixedDecimal.One(0);

  constructor(
    private _route: ActivatedRoute,
    private _tokensService: TokensService,
    private _router: Router,
    private _title: Title,
    private _gaService: GoogleAnalyticsService,
    private _sidebar: SidenavService,
    private _indexService: IndexService,
    private _lpService: LiquidityPoolsService,
    private _envService: EnvironmentsService,
    private _userContextService: UserContextService
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
      this._indexService.latestBlock$
        .pipe(
          switchMap(_ => this._userContextService.context$.pipe(tap(context => this.context = context))),
          switchMap(_ => this.getToken()),
          tap(_ => this.historyFilter?.refresh()),
          switchMap(_ => this.getTokenHistory()),
          switchMap(_ => this.tryGetLiquidityPool()))
        .subscribe());
  }

  private getToken(): Observable<MarketToken> {
    return this._tokensService.getMarketToken(this.tokenAddress)
      .pipe(
        catchError(_ => of(null)),
        tap((token: MarketToken) => {
          if (token === null) {
            this._router.navigateByUrl('/tokens');
            return;
          }

          if (!this.transactionsRequest || token.address !== this.token?.address) {
            const events = [
              this.transactionEventTypes.SwapEvent,
              this.transactionEventTypes.AddLiquidityEvent,
              this.transactionEventTypes.RemoveLiquidityEvent
            ];

            if (!token.isCrs) {
              events.push(this.transactionEventTypes.ApprovalEvent)

              token.isStaking
                ? events.push(this.transactionEventTypes.DistributionEvent)
                : events.push(this.transactionEventTypes.StartMiningEvent, this.transactionEventTypes.StopMiningEvent);
            }

            this.transactionsRequest = {
              limit: 15,
              eventTypes: events,
              contracts: token.isCrs ? [] : [token.address, token.liquidityPool],
              direction: 'DESC'
            }
          }

          // This will be true for initial page load or if the pool changes otherwise since we set this.token below
          if (!this.token || token.address !== this.token.address) {
            const name = `${token.symbol} - ${token.name}`;
            this._title.setTitle(name);
            this._gaService.pageView(this._route.routeConfig.path, name);
          }

          this.token = token;
          this.isCurrentMarket = this.token.market === this._envService.marketAddress;
        })
      );
  }

  private getTokenHistory(): Observable<any> {
    if (!this.token) return of(null);
    if (!this.historyFilter) this.historyFilter = new HistoryFilter();

    return this._tokensService.getTokenHistory(this.tokenAddress, this.historyFilter)
      .pipe(
        delay(10),
        tap(tokenHistory => this.chartsHistory = new TokenSnapshotHistory(this.token, tokenHistory)));
  }

  private tryGetLiquidityPool(): Observable<LiquidityPool> {
    if (!this.token || this.token.isCrs) return of(null);

    if (this.token.symbol === 'OLPT') {
      return this._lpService.getLiquidityPool(this.token.address)
        .pipe(tap(pool => {
          this.liquidityPool = pool;

          const olptSupply = pool.tokens.lp.totalSupply;
          const crsReserves = pool.summary.reserves.crs;
          const srcReserves = pool.summary.reserves.src;

          this.crsPerOlpt = crsReserves.divide(olptSupply);
          this.srcPerOlpt = srcReserves.divide(olptSupply);
        }));
    }

    const filter = new LiquidityPoolsFilter({
      tokens: [this.token.address],
      market: this._envService.marketAddress,
      limit: 1
    } as ILiquidityPoolsFilter);

    return this._lpService.getLiquidityPools(filter)
      .pipe(map(pools => {
        const pool = pools?.results?.length ? pools.results[0] : null;
        this.liquidityPool = pool;
        return pool;
      }));
  }

  handleTxOption($event: TransactionView): void {
    this._sidebar.openSidenav($event, {pool: this.liquidityPool});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
