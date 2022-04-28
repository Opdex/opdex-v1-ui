import { LiquidityPoolSnapshotHistory } from '@sharedModels/ui/liquidity-pools/liquidity-pool-history';
import { UserContext } from '@sharedModels/user-context';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { AddressPosition } from '@sharedModels/address-position';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ITransactionsRequest } from "@sharedModels/platform-api/requests/transactions/transactions-filter";
import { ISidenavMessage, TransactionView } from "@sharedModels/transaction-view";
import { LiquidityPoolsService } from "@sharedServices/platform/liquidity-pools.service";
import { SidenavService } from "@sharedServices/utility/sidenav.service";
import { UserContextService } from "@sharedServices/utility/user-context.service";
import { Observable, Subscription, of } from "rxjs";
import { tap, switchMap, catchError, delay, take } from "rxjs/operators";
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Icons } from 'src/app/enums/icons';
import { HistoryFilter } from '@sharedModels/platform-api/requests/history-filter';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { ILiquidityPoolSnapshotHistoryResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-snapshots-responses.interface';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

@Component({
  selector: 'opdex-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, OnDestroy {
  poolAddress: string;
  pool: LiquidityPool;
  subscription = new Subscription();
  routerSubscription = new Subscription();
  transactionsRequest: ITransactionsRequest;
  transactionEventTypes = TransactionEventTypes;
  chartData: any[];
  positions: any[];
  iconSizes = IconSizes;
  icons = Icons;
  context$: Observable<UserContext>;
  message: ISidenavMessage;
  historyFilter: HistoryFilter;
  isCurrentMarket: boolean;
  chartsHistory: LiquidityPoolSnapshotHistory;

  constructor(
    private _route: ActivatedRoute,
    private _userContext: UserContextService,
    private _sidenav: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _router: Router,
    private _title: Title,
    private _gaService: GoogleAnalyticsService,
    private _indexService: IndexService,
    private _env: EnvironmentsService
  ) {
    this.subscription.add(
      this._sidenav.getStatus()
        .subscribe((message: ISidenavMessage) => this.message = message));
  }

  ngOnInit(): void {
    this.init();
    this.context$ = this._userContext.context$;

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
      this._indexService.latestBlock$
        .pipe(
          switchMap(_ => this.getLiquidityPool()),
          tap(_ => this.historyFilter?.refresh()),
          switchMap(_ => this.getPoolHistory())
        ).subscribe());
  }

  openTransactionSidebar(view: TransactionView, childView: string = null) {
    const data = {
      pool: this.pool,
      child: childView
    }

    this._sidenav.openSidenav(view, data);
  }

  private getLiquidityPool(): Observable<LiquidityPool> {
    return this._liquidityPoolsService.getLiquidityPool(this.poolAddress)
      .pipe(
        catchError(_ => of(null)),
        take(1),
        tap((pool: LiquidityPool) => {
          if (!!pool === false) {
            this._router.navigateByUrl('/pools');
            return;
          }

          if (!this.transactionsRequest || pool.address !== this.pool?.address) {
            const contracts = [pool.address, pool.tokens.src.address];
            if (pool.hasMining) contracts.push(pool.miningPool.address);

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
          }

          // This will be true for initial page load or if the pool changes otherwise since we set this.pool below
          if (!this.pool || pool.address !== this.pool.address) {
            const name = `${pool.name} Liquidity Pool`;
            this._title.setTitle(name);
            this._gaService.pageView(this._route.routeConfig.path, name);
          }

          this.pool = pool;
          this.isCurrentMarket = this.pool.market === this._env.marketAddress;
        })
      );
  }

  private getPoolHistory(): Observable<ILiquidityPoolSnapshotHistoryResponse> {
    if (!this.pool) return of(null);
    if (!this.historyFilter) this.historyFilter = new HistoryFilter();

    return this._liquidityPoolsService.getLiquidityPoolHistory(this.poolAddress, this.historyFilter)
      .pipe(
        delay(10),
        tap((poolHistory: ILiquidityPoolSnapshotHistoryResponse) =>
          this.chartsHistory = new LiquidityPoolSnapshotHistory(this.pool, poolHistory)));
  }

  handleTxOption($event: TransactionView): void {
    this._sidenav.openSidenav($event, {pool: this.pool});
  }

  positionsTrackBy(index: number, position: AddressPosition): string {
    return `${index}-${position?.trackBy}`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
