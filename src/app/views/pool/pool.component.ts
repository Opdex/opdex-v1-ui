import { PlatformApiService } from './../../services/api/platform-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { SidenavService } from '@sharedServices/sidenav.service';
import { SidenavView } from '@sharedModels/sidenav-view';

@Component({
  selector: 'opdex-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
  chartType: string = 'Area';
  ohlcPoints: any[];
  theme$: Observable<string>;
  poolAddress: string;
  pool: any;
  transactions: any[];

  constructor(
    private _themeService: ThemeService,
    private _route: ActivatedRoute,
    private _platformApiService: PlatformApiService,
    private _sidenav: SidenavService
  ) {
    this.theme$ = this._themeService.getTheme();
    this.poolAddress = this._route.snapshot.params.pool;
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => this.ohlcPoints = [], 100);

    await Promise.all([
      this.getPool(),
      this.getPoolTransactions()
    ]);
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

  private async getPoolTransactions():Promise<void> {
    const transactionsResponse = await this._platformApiService.getPoolTransactions(this.poolAddress);
    if (transactionsResponse.hasError) {
      //handle
    }

    this.transactions = transactionsResponse.data;
    console.log(this.transactions)
  }
}
