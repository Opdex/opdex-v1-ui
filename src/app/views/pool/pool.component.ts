import { PlatformApiService } from './../../services/api/platform-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from '@sharedServices/sidenav.service';
import { SidenavView } from '@sharedModels/sidenav-view';
import { timer } from 'rxjs';

@Component({
  selector: 'opdex-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
  ohlcPoints: any[];
  poolAddress: string;
  pool: any;
  poolHistory: any[];
  transactions: any[];
  liquidityHistory: any[] = [];
  volumeHistory: any[] = [];
  walletBalance: any;

  constructor(
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService,
    private _sidenav: SidenavService
  ) {
    this.poolAddress = this._route.snapshot.params.pool;
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => this.ohlcPoints = [], 100);

    // 30 seconds refresh view
    timer(0, 30000)
      .subscribe(async () => {
        await Promise.all([
          this.getPool(),
          this.getPoolHistory(),
          this.getPoolTransactions(),
          this.getWalletSummary()
        ]);
      });
  }

  openTransactionSidebar(view: SidenavView) {
    const data = {
      pool: this.pool
    }

    this._sidenav.openSidenav(view, data);
  }

  private async getPool():Promise<void> {
    const poolResponse = await this._platformApiService.getPool(this.poolAddress);
    if (poolResponse.hasError) {
      //handle
    }

    this.pool = poolResponse.data;
  }

  private async getWalletSummary():Promise<void> {
    const response = await this._platformApiService.getWalletSummaryForPool(this.poolAddress, 'PTsyKGQJ3eD9jnhHZKtvDmCMyGVMNTHay6');
    if (response.hasError) {
      //handle
    }

    this.walletBalance = response.data;
    console.log(this.walletBalance);
  }

  private async getPoolHistory():Promise<void> {
    const poolResponse = await this._platformApiService.getPoolHistory(this.poolAddress);
    if (poolResponse.hasError) {
      //handle
    }

    this.poolHistory = poolResponse.data;

    let liquidityPoints = [];
    let volumePoints = [];

    this.poolHistory.forEach(history => {
      liquidityPoints.push({
        time: Date.parse(history.startDate)/1000,
        value: history.reserves.usd
      });

      volumePoints.push({
        time: Date.parse(history.startDate)/1000,
        value: history.volume.usd
      })
    });

    this.liquidityHistory = liquidityPoints;
    this.volumeHistory = volumePoints;
  }

  private async getPoolTransactions():Promise<void> {
    const transactionsResponse = await this._platformApiService.getPoolTransactions(this.poolAddress);
    if (transactionsResponse.hasError) {
      //handle
    }

    this.transactions = transactionsResponse.data;
  }
}
