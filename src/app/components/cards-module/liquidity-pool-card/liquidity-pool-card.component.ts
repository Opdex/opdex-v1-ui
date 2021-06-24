import { Component, Input, OnInit } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { SidenavView } from '@sharedModels/sidenav-view';
import { SidenavService } from '@sharedServices/sidenav.service';

@Component({
  selector: 'opdex-liquidity-pool-card',
  templateUrl: './liquidity-pool-card.component.html',
  styleUrls: ['./liquidity-pool-card.component.scss']
})
export class LiquidityPoolCardComponent implements OnInit {
  @Input() pool: ILiquidityPoolSummaryResponse;

  constructor(private _sidebar: SidenavService) { }

  ngOnInit(): void { }

  provide() {
    this._sidebar.openSidenav(SidenavView.pool, {pool: this.pool});
  }

  swap() {
    this._sidebar.openSidenav(SidenavView.swap, {pool: this.pool});
  }

  stake() {
    this._sidebar.openSidenav(SidenavView.stake, {pool: this.pool});
  }

  mine() {
    this._sidebar.openSidenav(SidenavView.mine, {pool: this.pool});
  }
}
