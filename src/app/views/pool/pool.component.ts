import { UserContextService } from '@sharedServices/user-context.service';
import { take, tap, switchMap } from 'rxjs/operators';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from '@sharedServices/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';
import { timer, Subscription, Observable } from 'rxjs';
import { ILiquidityPoolSnapshotHistoryResponse, ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionsRequest, TransactionRequest } from '@sharedModels/requests/transactions-filter';

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
  copied: boolean;


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
            this.getWalletSummary()
          ]);
        }));
  }

  openTransactionSidebar(view: TransactionView, childView: string = null) {
    const data = {
      pool: this.pool,
      child: childView
    }

    this._sidenav.openSidenav(view, data);
  }

  private getPool(): void {
    this._platformApiService.getPool(this.poolAddress)
      .pipe(
        take(1),
        tap(pool => this.pool = pool),
        switchMap((pool) => {
          return this.getPoolTransactions(pool)
        })
      )
      .subscribe();
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

  private getPoolTransactions(pool: ILiquidityPoolSummaryResponse): Observable<any> {
    var contracts = [pool.address, pool.token.src.address];

    if (pool?.mining?.address) contracts.push(pool.mining.address);

    var transactionRequest = {
      limit: 100,
      direction: "DESC",
      contracts: contracts
    };

    return this._platformApiService.getTransactions(new TransactionRequest(transactionRequest))
      .pipe(
        take(1),
        tap(transactions => this.transactions = transactions.transactionDtos)
      );
  }

  copyHandler($event) {
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 1000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
