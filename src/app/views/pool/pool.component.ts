import { BlocksService } from '@sharedServices/platform/blocks.service';
import { AddressPosition } from '@sharedModels/address-position';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { StatCardInfo } from "@sharedModels/stat-card-info";
import { ITransactionsRequest } from "@sharedModels/platform-api/requests/transactions/transactions-filter";
import { IAddressBalance } from "@sharedModels/platform-api/responses/wallets/address-balance.interface";
import { ILiquidityPoolResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface";
import { ISidenavMessage, TransactionView } from "@sharedModels/transaction-view";
import { LiquidityPoolsService } from "@sharedServices/platform/liquidity-pools.service";
import { SidenavService } from "@sharedServices/utility/sidenav.service";
import { UserContextService } from "@sharedServices/utility/user-context.service";
import { Observable, Subscription, zip, of } from "rxjs";
import { tap, switchMap, catchError, take, map, delay } from "rxjs/operators";
import { IAddressMining } from "@sharedModels/platform-api/responses/wallets/address-mining.interface";
import { IToken } from "@sharedModels/platform-api/responses/tokens/token.interface";
import { IAddressStaking } from '@sharedModels/platform-api/responses/wallets/address-staking.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Icons } from 'src/app/enums/icons';
import { LiquidityPoolHistory } from '@sharedModels/liquidity-pool-history';
import { HistoryFilter, HistoryInterval } from '@sharedModels/platform-api/requests/history-filter';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { PoolStatCardsLookup } from '@sharedLookups/pool-stat-cards.lookup';
import { ILiquidityPoolSnapshotHistoryResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-snapshots-responses.interface';

@Component({
  selector: 'opdex-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, OnDestroy {
  poolAddress: string;
  pool: ILiquidityPoolResponse;
  poolHistory: LiquidityPoolHistory;
  subscription = new Subscription();
  routerSubscription = new Subscription();
  transactionsRequest: ITransactionsRequest;
  transactionEventTypes = TransactionEventTypes;
  chartData: any[];
  positions: any[];
  iconSizes = IconSizes;
  icons = Icons;
  chartOptions = [
    {
      type: 'line',
      category: 'Liquidity',
      prefix: '$',
      decimals: 3
    },
    {
      type: 'bar',
      category: 'Volume',
      prefix: '$',
      decimals: 3
    },
    {
      type: 'line',
      category: 'Staking',
      suffix: '',
      decimals: 2
    },
    {
      type: 'candle',
      category: 'SRC/CRS',
      suffix: 'CRS',
      decimals: 8
    },
    {
      type: 'candle',
      category: 'CRS/SRC',
      suffix: 'SRC',
      decimals: 8
    }
  ]
  selectedChart = this.chartOptions[0];
  statCards: StatCardInfo[];
  context$: Observable<any>;
  message: ISidenavMessage;
  historyFilter: HistoryFilter;

  constructor(
    private _route: ActivatedRoute,
    private _userContext: UserContextService,
    private _sidenav: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _router: Router,
    private _title: Title,
    private _gaService: GoogleAnalyticsService,
    private _walletService: WalletsService,
    private _blocksService: BlocksService
  ) {
    // init stat cards with null for loading/default animations
    this.statCards = PoolStatCardsLookup.getStatCards(this.pool);

    this.subscription.add(
      this._sidenav.getStatus()
        .subscribe((message: ISidenavMessage) => this.message = message));

    this.positions = [ null, null, null, null ];
  }

  ngOnInit(): void {
    this.init();
    this.context$ = this._userContext.getUserContext$();

    this.routerSubscription.add(
      this._router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) return;
        this.init();
      })
    );
  }

  init() {
    this.poolAddress = this._route.snapshot.params.pool;

    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
      this.subscription = new Subscription();
    }

    this.subscription.add(
      this._blocksService.getLatestBlock$().pipe(
        switchMap(_ => this.getLiquidityPool()),
        tap(_ => this.historyFilter?.refresh()),
        switchMap(_ => this.getPoolHistory()),
        switchMap(_ => this.getWalletSummary())
      ).subscribe());
  }

  openTransactionSidebar(view: TransactionView, childView: string = null) {
    const data = {
      pool: this.pool,
      child: childView
    }

    this._sidenav.openSidenav(view, data);
  }

  private getLiquidityPool(): Observable<any> {
    return this._liquidityPoolsService.getLiquidityPool(this.poolAddress)
      .pipe(
        catchError(_ => of(null)),
        tap(pool => this.pool = pool),
        map((pool) => {
          if (pool === null) {
            this._router.navigateByUrl('/pools');
            return;
          }

          var contracts = [pool.address, pool.token.src.address];

          if (pool?.summary?.miningPool?.address) contracts.push(pool.summary.miningPool.address);

          this.transactionsRequest = {
            limit: 15,
            direction: "DESC",
            contracts: contracts,
            eventTypes: [
              this.transactionEventTypes.SwapEvent,
              this.transactionEventTypes.StartStakingEvent,
              this.transactionEventTypes.StopStakingEvent,
              this.transactionEventTypes.CollectStakingRewardsEvent,
              this.transactionEventTypes.StartMiningEvent,
              this.transactionEventTypes.StopMiningEvent,
              this.transactionEventTypes.AddLiquidityEvent,
              this.transactionEventTypes.RemoveLiquidityEvent,
              this.transactionEventTypes.CollectMiningRewardsEvent,
              this.transactionEventTypes.EnableMiningEvent,
              this.transactionEventTypes.NominationEvent
            ],
          };

          if (this.pool){
            this._gaService.pageView(this._route.routeConfig.path, `${this.pool.name} Liquidity Pool`)
            this._title.setTitle(`${this.pool.name} Liquidity Pool`);
            this.statCards = PoolStatCardsLookup.getStatCards(this.pool);
            this.chartOptions.map(o => {
              if (o.category === 'Staking') o.suffix = pool.summary.staking?.token?.symbol;
              return 0;
            });
          }
        })
      );
  }

  private getTokenBalance(walletAddress: string, token: IToken): Observable<AddressPosition> {
    return this._walletService.getBalance(walletAddress, token.address)
        .pipe(
          catchError(() => of(null)),
          map((result: IAddressBalance) => new AddressPosition(walletAddress, token, 'Balance', new FixedDecimal(result?.balance || '0', token.decimals))),
          take(1));
  }

  private getStakingPosition(walletAddress: string, liquidityPoolAddress: string, token: IToken): Observable<AddressPosition> {
    return this._walletService.getStakingPosition(walletAddress, liquidityPoolAddress)
        .pipe(
          catchError(() => of(null)),
          map((result: IAddressStaking) => new AddressPosition(walletAddress, token, 'Staking', new FixedDecimal(result?.amount || '0', token.decimals))),
          take(1));
  }

  private getMiningPosition(walletAddress: string, miningPoolAddress: string, token: IToken): Observable<AddressPosition> {
    return this._walletService.getMiningPosition(walletAddress, miningPoolAddress)
        .pipe(
          catchError(() => of(null)),
          map((result: IAddressMining) => new AddressPosition(walletAddress, token, 'Mining', new FixedDecimal(result?.amount || '0', token.decimals))),
          take(1));
  }

  private getWalletSummary(): Observable<AddressPosition[]> {
    const context = this._userContext.getUserContext();

    if (context.wallet && this.pool) {
      const crsToken = this.pool.token.crs;
      const srcToken = this.pool.token.src;
      const lpToken = this.pool.token.lp;
      const stakingToken = this.pool.summary.staking?.token;

      const combo = [
        this.getTokenBalance(context.wallet, crsToken),
        this.getTokenBalance(context.wallet, srcToken)
      ];

      // Yes, this can be added to the initial array, but this order is better for UX
      combo.push(this.getTokenBalance(context.wallet, lpToken));

      // Yes, this could be combined with the above check, but this order is better for UX
      if (stakingToken) {
        combo.push(this.getStakingPosition(context.wallet, this.poolAddress, stakingToken));
      }

      if (this.pool.summary.miningPool) {
        combo.push(this.getMiningPosition(context.wallet, this.pool.summary.miningPool.address, lpToken));
      }

      return zip(...combo).pipe(take(1), tap(results => this.positions = results));
    }

    return of([]);
  }

  private getPoolHistory(): Observable<ILiquidityPoolSnapshotHistoryResponse> {
    if (!this.pool) return of(null);

    if (!this.historyFilter) this.historyFilter = new HistoryFilter();

    return this._liquidityPoolsService.getLiquidityPoolHistory(this.poolAddress, this.historyFilter)
      .pipe(
        take(1),
        delay(10),
        tap(() => {
          this.chartOptions.map(o => {
            if (o.category.includes('/') && o.type === 'candle') {
              const parts = o.category.split('/');
              const prefixIsCrs = parts[0].includes('CRS');

              if (prefixIsCrs) {
                o.suffix = this.pool.token.src.symbol;
                o.decimals = this.pool.token.src.decimals
              } else {
                o.suffix = this.pool.token.crs.symbol;
              }

              o.category = prefixIsCrs
                ? `${this.pool.token.crs.symbol}/${this.pool.token.src.symbol}`
                : `${this.pool.token.src.symbol}/${this.pool.token.crs.symbol}`;
            }

            return o;
          });
        }),
        tap((poolHistory: ILiquidityPoolSnapshotHistoryResponse) => {
          this.poolHistory = new LiquidityPoolHistory(poolHistory);
          this.handleChartTypeChange(this.selectedChart.category);
      }));
  }

  handleChartTypeChange($event: string): void {
    this.selectedChart = this.chartOptions.find(options => options.category === $event);

    if ($event === 'Liquidity') {
      this.chartData = this.poolHistory.liquidity;
    } else if ($event === 'Volume') {
      this.chartData = this.poolHistory.volume;
    } else if ($event === 'Staking') {
      this.chartData = this.poolHistory.staking;
    } else if ($event === `${this.pool.token.crs.symbol}/${this.pool.token.src.symbol}`) {
      this.chartData = this.poolHistory.srcPerCrs;
    } else if ($event === `${this.pool.token.src.symbol}/${this.pool.token.crs.symbol}`) {
      this.chartData = this.poolHistory.crsPerSrc;
    }
  }

  handleChartTimeChange(timeSpan: string): void {
    let startDate = HistoryFilter.startOfDay(new Date());
    let endDate = HistoryFilter.endOfDay(new Date());
    let interval = HistoryInterval.Daily;

    if (timeSpan === '1M') {
      startDate = HistoryFilter.historicalDate(startDate, 30);
    } else if (timeSpan === '1W') {
      startDate = HistoryFilter.historicalDate(startDate, 7);
      interval = HistoryInterval.Hourly;
    } else if (timeSpan === '1D') {
      startDate = HistoryFilter.historicalDate(startDate, 1);
      interval = HistoryInterval.Hourly;
    } else {
      startDate = HistoryFilter.historicalDate(startDate, 365);
    }

    this.historyFilter = new HistoryFilter(startDate, endDate, interval);

    this.getPoolHistory().pipe(take(1)).subscribe();
  }

  handleTxOption($event: TransactionView): void {
    this._sidenav.openSidenav($event, {pool: this.pool});
  }

  statCardTrackBy(index: number, statCard: StatCardInfo): string {
    return `${index}-${statCard.title}-${statCard.value}`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
