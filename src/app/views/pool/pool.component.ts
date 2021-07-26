import { environment } from '@environments/environment';
import { UserContextService } from '@sharedServices/user-context.service';
import { take, tap, switchMap, catchError } from 'rxjs/operators';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from '@sharedServices/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { timer, Subscription, Observable, of, zip } from 'rxjs';
import { ILiquidityPoolSnapshotHistoryResponse, ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionsRequest } from '@sharedModels/requests/transactions-filter';
import { IAddressBalanceResponse } from '@sharedModels/responses/platform-api/Addresses/address_balance.interface';

@Component({
  selector: 'opdex-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, OnDestroy {
  poolAddress: string;
  pool: ILiquidityPoolSummaryResponse;
  poolHistory: ILiquidityPoolSnapshotHistoryResponse;
  crsBalance: IAddressBalanceResponse;
  srcBalance$: Observable<IAddressBalanceResponse>;
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
    private _sidenav: SidenavService
  ) {
    this.poolAddress = this._route.snapshot.params.pool;
  }

  async ngOnInit(): Promise<void> {
    // 30 seconds refresh view
    this.subscription.add(
      timer(0, 30000)
        .pipe(
          // RXJS implementation of Promise.All, fire all requests at the same time
          switchMap(() => zip(this.getPool(), this.getPoolHistory(), this.getCrsBalance(), this.getWalletSummary()))
        ).subscribe());
  }

  openTransactionSidebar(view: TransactionView, childView: string = null) {
    const data = {
      pool: this.pool,
      child: childView
    }

    this._sidenav.openSidenav(view, data);
  }

  private getPool(): Observable<ILiquidityPoolSummaryResponse> {
    return this._platformApiService.getPool(this.poolAddress)
      .pipe(
        take(1),
        tap(pool => this.pool = pool),
        tap((pool) => {
          const miningGovernance = environment.governanceAddress;

          var contracts = [pool.address, pool.token.src.address, miningGovernance];

          if (pool?.mining?.address)
            contracts.push(pool.mining.address);

          this.transactionsRequest = {
            limit: 10,
            direction: "DESC",
            contracts: contracts,
            eventTypes: ['SwapEvent', 'ProvideEvent', 'StakeEvent', 'CollectStakingRewardsEvent', 'MineEvent', 'CollectMiningRewardsEvent', 'EnableMiningEvent', 'NominationEvent',]
          };
        })
      );
  }

  private getCrsBalance(): Observable<IAddressBalanceResponse> {
    const context = this._userContext.getUserContext();

    if (context.wallet) {
      return this._platformApiService.getBalance(context.wallet, 'CRS')
        .pipe(tap((rsp: IAddressBalanceResponse) => this.crsBalance = rsp), catchError(() => of(null)));
    }

    return of();
  }

  private getWalletSummary(): Observable<any> {
    const context = this._userContext.getUserContext();

    if (context.wallet) {
      return this._platformApiService.getWalletSummaryForPool(this.poolAddress, context.wallet)
        .pipe(take(1), tap(walletSummary => this.walletBalance = walletSummary));
    }

    return of();
  }

  private getPoolHistory(): Observable<ILiquidityPoolSnapshotHistoryResponse> {
    return this._platformApiService.getPoolHistory(this.poolAddress)
      .pipe(take(1),
        tap((poolHistory: ILiquidityPoolSnapshotHistoryResponse) => {
          this.poolHistory = poolHistory;

          let liquidityPoints = [];
          let volumePoints = [];
          let stakingPoints = [];

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
          });

          this.liquidityHistory = liquidityPoints;
          this.volumeHistory = volumePoints;
          this.stakingHistory = stakingPoints;

          this.handleChartTypeChange(this.selectedChart.category);
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
