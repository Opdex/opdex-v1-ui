import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { Component, OnInit } from '@angular/core';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';
import { LiquidityPoolsSearchQuery } from '@sharedModels/platform-api/requests/liquidity-pool-filter';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { TransactionView } from '@sharedModels/transaction-view';

@Component({
  selector: 'opdex-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss']
})
export class PoolsComponent implements OnInit {
  pools$: Observable<ILiquidityPoolSummary[]>;
  poolsByVolume$: Observable<ILiquidityPoolSummary[]>;
  poolsMining$: Observable<ILiquidityPoolSummary[]>;

  constructor(
    private _platformApiService: PlatformApiService,
    private _sidebar: SidenavService
  ) { }

  ngOnInit(): void {
    this.poolsByVolume$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Volume', 'DESC', 0, 4));

    this.poolsMining$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 4, {mining: true}));

    this.pools$ = this._platformApiService.getPools(new LiquidityPoolsSearchQuery('Liquidity', 'DESC', 0, 10));
  }

  createPool() {
    this._sidebar.openSidenav(TransactionView.createPool);
  }
}
