import { MathService } from '@sharedServices/utility/math.service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { environment } from "@environments/environment";
import { StatCardInfo } from "@sharedComponents/cards-module/stat-card/stat-card-info";
import { ITransactionsRequest } from "@sharedModels/requests/transactions-filter";
import { IAddressBalance } from "@sharedModels/responses/platform-api/wallets/address-balance.interface";
import { ILiquidityPoolSummary, ILiquidityPoolSnapshotHistory } from "@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface";
import { TransactionView } from "@sharedModels/transaction-view";
import { PlatformApiService } from "@sharedServices/api/platform-api.service";
import { LiquidityPoolsService } from "@sharedServices/platform/liquidity-pools.service";
import { SidenavService } from "@sharedServices/utility/sidenav.service";
import { UserContextService } from "@sharedServices/utility/user-context.service";
import { Observable, Subscription, zip, of, interval } from "rxjs";
import { tap, switchMap, catchError, take, map, delay } from "rxjs/operators";
import { IAddressMining } from "@sharedModels/responses/platform-api/wallets/address-mining.interface";
import { IToken } from "@sharedModels/responses/platform-api/tokens/token.interface";
import { IAddressStaking } from '@sharedModels/responses/platform-api/wallets/address-staking.interface';

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
      suffix: 'ODX',
      decimals: 2
    },
    {
      type: 'candle',
      category: 'SRC/CRS',
      suffix: 'SRC',
      decimals: 8
    },
    {
      type: 'candle',
      category: 'CRS/SRC',
      suffix: 'CRS',
      decimals: 8
    }
  ]
  selectedChart = this.chartOptions[0];
  statCards: StatCardInfo[];

  constructor(
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService,
    private _userContext: UserContextService,
    private _sidenav: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _math: MathService,
    private _router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.init();

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
      .pipe(switchMap(() => this.getPoolHistory()), take(1))
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
        tap(pool => this.pool = pool),
        map((pool) => {
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
            this.setPoolStatCards();
          }
        }),
        switchMap(_ => this.getWalletSummary())
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
        helpInfo: {
          title: 'What is Liquidity Mining?',
          paragraph: 'Liquidity mining is when new governance tokens are mined when liquidity is provided and staked in mining pools. This indicator displays the totals current being used for mining within the liquidity pool whether liquidity mining is currently active or not.'
        }
      }
    ];
  }

  private getTokenBalance(walletAddress: string, tokenAddress: string, token: IToken): Observable<IAddressBalance> {
    return this._platformApiService.getBalance(walletAddress, tokenAddress)
        .pipe(
          map((result: IAddressBalance) => {
            return {
              token: token,
              position: 'Balance',
              amount: result.balance,
              value: this._math.multiply(result.balance, token.summary.price.close as number)
            }
          }),
          take(1),
          catchError(() => of(null)));
  }

  private getStakingPosition(walletAddress: string, liquidityPoolAddress: string, token: IToken): Observable<IAddressBalance> {
    return this._platformApiService.getStakingPosition(walletAddress, liquidityPoolAddress)
        .pipe(
          map((result: IAddressStaking) => {
            return {
              token: token,
              position: 'Staking',
              amount: result.amount,
              value: this._math.multiply(result.amount, token.summary.price.close as number)
            }
          }),
          take(1),
          catchError(() => of(null)));
  }

  private getMiningPosition(walletAddress: string, miningPoolAddress: string, token: IToken): Observable<IAddressBalance> {
    return this._platformApiService.getMiningPosition(walletAddress, miningPoolAddress)
        .pipe(map((result: IAddressMining) => {
          return {
            token: token,
            position: 'Mining',
            amount: result.amount,
            value: this._math.multiply(result.amount, token.summary.price.close as number)
          }
        }),
        take(1),
        catchError(() => of(null)));
  }

  private getWalletSummary(): Observable<IAddressBalance[]> {
    const context = this._userContext.getUserContext();

    if (context.wallet && this.pool) {
      const combo = [
        this.getTokenBalance(context.wallet, 'CRS', this.pool?.token?.crs),
        this.getTokenBalance(context.wallet, this.pool?.token?.src?.address, this.pool?.token?.src),
        this.getTokenBalance(context.wallet, this.poolAddress, this.pool?.token?.lp),
      ];

      if (this.pool?.token?.staking) {
        combo.push(this.getTokenBalance(context.wallet, this.pool?.token?.staking?.address, this.pool?.token?.staking));
        combo.push(this.getStakingPosition(context.wallet, this.poolAddress, this.pool?.token?.staking));
      }

      if (this.pool?.mining) {
        combo.push(this.getMiningPosition(context.wallet, this.pool?.mining?.address, this.pool.token.lp));
      }

      return zip(...combo).pipe(
        tap(results => this.positions = results.filter(result => result !== null)),
        take(1));
    }

    return of([]);
  }

  private getPoolHistory(): Observable<ILiquidityPoolSnapshotHistory> {
    return this._liquidityPoolsService.getLiquidityPoolHistory(this.poolAddress)
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

  handleChartTypeChange($event) {
    this.selectedChart = this.chartOptions.find(options => options.category === $event);

    if ($event === 'Liquidity') {
      this.chartData = this.liquidityHistory;
    } else if ($event === 'Volume') {
      this.chartData = this.volumeHistory;
    } else if ($event === 'Staking') {
      this.chartData = this.stakingHistory;
    } else if ($event === `CRS/${this.pool.token.src.symbol}`) {
      this.chartData = this.crsPerSrcHistory;
    } else if ($event === `${this.pool.token.src.symbol}/CRS`) {
      this.chartData = this.srcPerCrsHistory;
    }
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
