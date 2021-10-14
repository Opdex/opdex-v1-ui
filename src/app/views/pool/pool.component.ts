import { AddressPosition } from '@sharedModels/address-position';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { IconSizes } from './../../enums/icon-sizes';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { environment } from "@environments/environment";
import { StatCardInfo } from "@sharedComponents/cards-module/stat-card/stat-card-info";
import { ITransactionsRequest } from "@sharedModels/platform-api/requests/transactions-filter";
import { IAddressBalance } from "@sharedModels/platform-api/responses/wallets/address-balance.interface";
import { ILiquidityPoolSummary, ILiquidityPoolSnapshotHistory } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface";
import { TransactionView } from "@sharedModels/transaction-view";
import { LiquidityPoolsService } from "@sharedServices/platform/liquidity-pools.service";
import { SidenavService } from "@sharedServices/utility/sidenav.service";
import { UserContextService } from "@sharedServices/utility/user-context.service";
import { Observable, Subscription, zip, of, interval } from "rxjs";
import { tap, switchMap, catchError, take, map, delay } from "rxjs/operators";
import { IAddressMining } from "@sharedModels/platform-api/responses/wallets/address-mining.interface";
import { IToken } from "@sharedModels/platform-api/responses/tokens/token.interface";
import { IAddressStaking } from '@sharedModels/platform-api/responses/wallets/address-staking.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, OnDestroy {
  poolAddress: string;
  pool: ILiquidityPoolSummary;
  poolHistory: ILiquidityPoolSnapshotHistory;
  crsBalance: IAddressBalance;
  srcBalance$: Observable<IAddressBalance>;
  transactions: any[];
  liquidityHistory: any[] = [];
  stakingHistory: any[] = [];
  volumeHistory: any[] = [];
  crsPerSrcHistory: any[] = [];
  srcPerCrsHistory: any[] = [];
  walletBalance: any;
  subscription = new Subscription();
  routerSubscription = new Subscription();
  copied: boolean;
  transactionsRequest: ITransactionsRequest;
  chartData: any[];
  positions: any[];
  iconSizes = IconSizes;
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

  constructor(
    private _route: ActivatedRoute,
    private _userContext: UserContextService,
    private _sidenav: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _router: Router,
    private _title: Title,
    private _gaService: GoogleAnalyticsService,
    private _walletService: WalletsService
  ) { }

  async ngOnInit(): Promise<void> {
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

    this.subscription.add(interval(30000)
      .pipe(
        tap(_ => {
          this._liquidityPoolsService.refreshPool(this.poolAddress);
          this._liquidityPoolsService.refreshPoolHistory(this.poolAddress);
        }))
      .subscribe());

    // Todo: take(1) stops taking after 1, but without it, _I think_ is mem leak
    this.subscription.add(this.getLiquidityPool()
      .pipe(
        switchMap(() => this.getPoolHistory()),
        switchMap(_ => this.getWalletSummary()),
        take(1))
      .subscribe());
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
            this._router.navigateByUrl('/not-found');
            return;
          }

          const miningGovernance = environment.governanceAddress;

          var contracts = [pool.address, pool.token.src.address];

          if (pool?.mining?.address) contracts.push(pool.mining.address);

          this.transactionsRequest = {
            limit: 10,
            direction: "DESC",
            contracts: contracts,
            eventTypes: ['SwapEvent', 'StartStakingEvent', 'StopStakingEvent', 'CollectStakingRewardsEvent', 'StartMiningEvent', 'StopMiningEvent', 'AddLiquidityEvent', 'RemoveLiquidityEvent', 'CollectMiningRewardsEvent', 'EnableMiningEvent', 'NominationEvent',]
          };

          if (this.pool){
            this._gaService.pageView(this._route.routeConfig.path, `${this.pool.token.src.symbol}-${this.pool.token.crs.symbol} Liquidity Pool`)
            this._title.setTitle(`${this.pool.token.src.symbol}-${this.pool.token.crs.symbol} Liquidity Pool`);
            this.setPoolStatCards();

            this.chartOptions.map(o => {
              if (o.category === 'Staking') o.suffix = pool.token?.staking?.symbol;
              return 0;
            });
          }
        })
      );
  }

  private setPoolStatCards(): void {
    this.statCards = [
      {
        title: 'Liquidity',
        value: this.pool.reserves.usd.toString(),
        prefix: '$',
        change: this.pool.reserves.usdDailyChange,
        show: true,
        icon: Icons.liquidityPool,
        iconColor: 'primary',
        helpInfo: {
          title: 'What is Liquidity?',
          paragraph: 'Liquidity represents the total USD amount of tokens locked in liquidity pools through provisioning. Liquidity can be measured for the market as a whole, or at an individual liquidity pool level.'
        }
      },
      {
        title: 'Staking Weight',
        value: this.pool.staking?.weight,
        suffix: this.pool.token.staking?.symbol,
        change: this.pool.staking?.weightDailyChange || 0,
        show: true,
        icon: Icons.staking,
        iconColor: 'stake',
        helpInfo: {
          title: 'What is Staking?',
          paragraph: 'Staking in liquidity pools acts as voting in the mining governance to enable liquidity mining. This indicator displays how many tokens are staking and can be represented for the market as a whole or at an individual staking pool level.'
        }
      },
      {
        title: 'Volume',
        value: this.pool.volume.usd.toString(),
        prefix: '$',
        daily: true,
        show: true,
        icon: Icons.volume,
        iconColor: 'primary',
        helpInfo: {
          title: 'What is Volume?',
          paragraph: 'Volume is the total USD value of tokens swapped and is usually displayed on a daily time frame. Volume tracks the value of tokens input to the protocol during swaps including transaction fees.'
        }
      },
      {
        title: 'Rewards',
        value: this.pool.rewards.totalUsd.toString(),
        daily: true,
        prefix: '$',
        show: true,
        icon: Icons.rewards,
        iconColor: 'provide',
        helpInfo: {
          title: 'What are Rewards?',
          paragraph: 'The rewards indicator displays the total USD value of transaction fees accumulated based on the volume of swap transactions. Rewards are collected by participants for providing liquidity and for staking in active markets.'
        }
      },
      {
        title: 'Liquidity Mining',
        value: this.pool.mining?.tokensMining,
        suffix: this.pool.token.lp.symbol,
        show: this.pool.mining != null && (this.pool.mining?.isActive || this.pool.mining?.tokensMining !== '0.00000000'),
        icon: Icons.mining,
        iconColor: 'mine',
        helpInfo: {
          title: 'What is Liquidity Mining?',
          paragraph: 'Liquidity mining is when new governance tokens are mined when liquidity is provided and staked in mining pools. This indicator displays the totals current being used for mining within the liquidity pool whether liquidity mining is currently active or not.'
        }
      }
    ];
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
      const stakingToken = this.pool.token.staking;

      const combo = [
        this.getTokenBalance(context.wallet, crsToken),
        this.getTokenBalance(context.wallet, srcToken),
      ];

      if (stakingToken) {
        combo.push(this.getTokenBalance(context.wallet, stakingToken));
      }

      // Yes, this can be added to the initial array, but this order is better for UX
      combo.push(this.getTokenBalance(context.wallet, lpToken));

      // Yes, this could be combined with the above check, but this order is better for UX
      if (stakingToken) {
        combo.push(this.getStakingPosition(context.wallet, this.poolAddress, stakingToken));
      }

      if (this.pool.mining) {
        combo.push(this.getMiningPosition(context.wallet, this.pool.mining.address, lpToken));
      }

      return zip(...combo).pipe(take(1), tap(results => this.positions = results));
    }

    return of([]);
  }

  private getPoolHistory(timeSpan: string = '1Y'): Observable<ILiquidityPoolSnapshotHistory> {
    if (!this.pool) return of(null);

    return this._liquidityPoolsService.getLiquidityPoolHistory(this.poolAddress, timeSpan)
      .pipe(
        take(1),
        delay(10),
        tap(() => {
          this.chartOptions.map(o => {
            if (o.suffix === 'SRC') {
              o.suffix = this.pool.token.src.symbol;
              o.decimals = this.pool.token.src.decimals
            }

            if (o.category.includes('SRC')) {
              o.category = o.category.replace('SRC', this.pool.token.src.symbol);
            }

            if (o.suffix === 'CRS') {
              o.suffix = this.pool.token.crs.symbol;
            }

            if (o.category.includes('/')) {
              var parts = o.category.split('/');

              o.category = parts[0].includes('CRS')
                ? `${this.pool.token.crs.symbol}/${parts[1]}`
                : `${parts[0]}/${this.pool.token.crs.symbol}`;
            }

            return o;
          });
        }),
        tap((poolHistory: ILiquidityPoolSnapshotHistory) => {
          this.poolHistory = poolHistory;

          let liquidityPoints = [];
          let volumePoints = [];
          let stakingPoints = [];
          let crsPerSrcHistory = [];
          let srcPerCrsHistory = [];

          this.poolHistory.snapshotHistory.forEach(history => {
            const time = Date.parse(history.startDate.toString()) / 1000;

            liquidityPoints.push({
              time,
              value: history.reserves.usd
            });

            volumePoints.push({
              time,
              value: history.volume.usd
            });

            stakingPoints.push({
              time,
              value: parseFloat(history.staking.weight.split('.')[0])
            });

            crsPerSrcHistory.push({
              time,
              open: history.cost.crsPerSrc.open,
              high: history.cost.crsPerSrc.high,
              low: history.cost.crsPerSrc.low,
              close: history.cost.crsPerSrc.close,
            });

            srcPerCrsHistory.push({
              time,
              open: history.cost.srcPerCrs.open,
              high: history.cost.srcPerCrs.high,
              low: history.cost.srcPerCrs.low,
              close: history.cost.srcPerCrs.close,
            })
          });

          this.liquidityHistory = liquidityPoints;
          this.volumeHistory = volumePoints;
          this.stakingHistory = stakingPoints;
          this.crsPerSrcHistory = crsPerSrcHistory;
          this.srcPerCrsHistory = srcPerCrsHistory;

          this.handleChartTypeChange(this.selectedChart.category);
      }));
  }

  handleChartTypeChange($event: string) {
    this.selectedChart = this.chartOptions.find(options => options.category === $event);

    if ($event === 'Liquidity') {
      this.chartData = this.liquidityHistory;
    } else if ($event === 'Volume') {
      this.chartData = this.volumeHistory;
    } else if ($event === 'Staking') {
      this.chartData = this.stakingHistory;
    } else if ($event === `${this.pool.token.crs.symbol}/${this.pool.token.src.symbol}`) {
      this.chartData = this.srcPerCrsHistory;
    } else if ($event === `${this.pool.token.src.symbol}/${this.pool.token.crs.symbol}`) {
      this.chartData = this.crsPerSrcHistory;
    }
  }


  handleChartTimeChange($event: string) {
    this.getPoolHistory($event).pipe(take(1)).subscribe();
  }

  provide() {
    this._sidenav.openSidenav(TransactionView.provide, {pool: this.pool});
  }

  swap() {
    this._sidenav.openSidenav(TransactionView.swap, {pool: this.pool});
  }

  stake() {
    this._sidenav.openSidenav(TransactionView.stake, {pool: this.pool});
  }

  mine() {
    this._sidenav.openSidenav(TransactionView.mine, {pool: this.pool});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
