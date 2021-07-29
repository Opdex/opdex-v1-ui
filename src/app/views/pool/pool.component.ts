import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { environment } from '@environments/environment';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { Subscription, interval, Observable, of } from 'rxjs';
import { ILiquidityPoolSnapshotHistoryResponse, ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';

@Component({
  selector: 'opdex-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, OnDestroy {
  poolAddress: string;
  pool: ILiquidityPoolSummaryResponse;
  poolHistory: ILiquidityPoolSnapshotHistoryResponse;
  transactions: any[];
  liquidityHistory: any[] = [];
  stakingHistory: any[] = [];
  volumeHistory: any[] = [];
  walletBalance: any;
  subscription = new Subscription();
  copied: boolean;
  transactionsRequest: ITransactionsRequest;
  chartData: any[];
  chartOptions = [
    {
      type: 'line',
      category: 'Liquidity',
      prefix: '$'
    },
    {
      type: 'bar',
      category: 'Volume',
      prefix: '$'
    },
    {
      type: 'line',
      category: 'Staking Weight',
      suffix: 'ODX'
    }
  ]
  selectedChart = this.chartOptions[0];

  constructor(
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService,
    private _userContext: UserContextService,
    private _sidenav: SidenavService,
    private _liquidityPoolsService: LiquidityPoolsService
  ) {
    this.poolAddress = this._route.snapshot.params.pool;
  }

  async ngOnInit(): Promise<void> {
    this.subscription.add(interval(30000)
      .pipe(tap(_ => this._liquidityPoolsService.refreshPool(this.poolAddress)))
      .subscribe());

    this.subscription.add(this.getLiquidityPool()
      .pipe(
        switchMap(() => this.getPoolHistory()),
        switchMap(() => this.getWalletSummary()))
      .subscribe());
  }

  openTransactionSidebar(view: TransactionView, childView: string = null) {
    const data = {
      pool: this.pool,
      child: childView
    }

    this._sidenav.openSidenav(view, data);
  }

  private getLiquidityPool(): Observable<ILiquidityPoolSummaryResponse> {
    return this._liquidityPoolsService.getLiquidityPool(this.poolAddress)
      .pipe(
        tap(pool => this.pool = pool),
        tap((pool) => {
          const miningGovernance = environment.governanceAddress;

          var contracts = [pool.address, pool.token.src.address, miningGovernance];

          if (pool?.mining?.address) contracts.push(pool.mining.address);

          this.transactionsRequest = {
            limit: 25,
            direction: "DESC",
            contracts: contracts,
            eventTypes: ['SwapEvent', 'ProvideEvent', 'StakeEvent', 'CollectStakingRewardsEvent', 'MineEvent', 'CollectMiningRewardsEvent', 'EnableMiningEvent', 'NominationEvent', ]
          };
        })
      );
  }

  private getWalletSummary(): Observable<void> {
    const context = this._userContext.getUserContext();
    if (context.wallet) {
      return this._platformApiService.getWalletSummaryForPool(this.poolAddress, context.wallet)
        .pipe(take(1), tap(walletSummary => this.walletBalance = walletSummary));
    }

    return of();
  }

  private getPoolHistory(): Observable<void> {
    return this._platformApiService.getPoolHistory(this.poolAddress)
      .pipe(
      take(1),
      map(poolHistory => {
        console.log('hit')
        this.poolHistory = poolHistory;

        let liquidityPoints = [];
        let volumePoints = [];
        let stakingPoints = [];

        this.poolHistory.snapshotHistory.forEach(history => {
          const time = Date.parse(history.startDate.toString())/1000;

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
        });

        this.liquidityHistory = liquidityPoints;
        this.volumeHistory = volumePoints;
        this.stakingHistory = stakingPoints;

        this.handleChartTypeChange(this.selectedChart.category);

        return;
      }));
  }

  copyHandler($event) {
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 1000);
  }

  handleChartTypeChange($event) {
    this.selectedChart = this.chartOptions.find(options => options.category === $event);

    if ($event === 'Liquidity') {
      this.chartData = this.liquidityHistory;
    }

    if ($event === 'Volume') {
      this.chartData = this.volumeHistory;
    }

    if ($event === 'Staking Weight') {
      this.chartData = this.stakingHistory;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
