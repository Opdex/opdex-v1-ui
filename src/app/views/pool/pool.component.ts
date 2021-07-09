import { UserContextService } from './../../services/user-context.service';
import { take } from 'rxjs/operators';
import { PlatformApiService } from './../../services/api/platform-api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from '@sharedServices/sidenav.service';
import { SidenavView } from '@sharedModels/sidenav-view';
import { timer, Subscription } from 'rxjs';
import { environment } from '@environments/environment';
import { ILiquidityPoolSnapshotHistoryResponse, ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';

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
  volumeHistory: any[] = [];
  walletBalance: any;
  subscription = new Subscription();

  constructor(
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService,
    private _userContext: UserContextService,
    private _sidenav: SidenavService
  ) {
    this.poolAddress = this._route.snapshot.params.pool;
  }

  async ngOnInit(): Promise<void> {
    // 10 seconds refresh view
    this.subscription.add(
      timer(0, 10000)
        .subscribe(async () => {
          await Promise.all([
            this.getPool(),
            this.getPoolHistory(),
            this.getPoolTransactions(),
            this.getWalletSummary()
          ]);
        }));
  }

  openTransactionSidebar(view: SidenavView, childView: string = null) {
    const data = {
      pool: this.pool,
      child: childView
    }

    this._sidenav.openSidenav(view, data);
  }

  private getPool(): void {
    this._platformApiService.getPool(this.poolAddress)
      .pipe(take(1))
      .subscribe(pool => this.pool = pool);
  }

  private getWalletSummary(): void {
    const context = this._userContext.getUserContext();
    if (context.wallet) {
      this._platformApiService.getWalletSummaryForPool(this.poolAddress, context.wallet)
        .pipe(take(1))
        .subscribe(walletSummary => {
          this.walletBalance = walletSummary;
        })
    }
  }

  private getPoolHistory(): void {
    this._platformApiService.getPoolHistory(this.poolAddress)
      .pipe(take(1))
      .subscribe(poolHistory => {
        this.poolHistory = poolHistory;

        let liquidityPoints = [];
        let volumePoints = [];

        this.poolHistory.snapshotHistory.forEach(history => {
          liquidityPoints.push({
            time: Date.parse(history.startDate.toString())/1000,
            value: history.reserves.usd
          });

          volumePoints.push({
            time: Date.parse(history.startDate.toString())/1000,
            value: history.volume.usd
          })
        });

        this.liquidityHistory = liquidityPoints;
        this.volumeHistory = volumePoints;
      });
  }

  private getPoolTransactions(): void {
    this._platformApiService.getPoolTransactions(this.poolAddress)
      .pipe(take(1))
      .subscribe(transactions => this.transactions = transactions);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
