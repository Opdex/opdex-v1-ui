import { SidenavService } from '@sharedServices/sidenav.service';
import { Component, Input } from '@angular/core';
import { SidenavView } from '@sharedModels/sidenav-view';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-mining-card',
  templateUrl: './mining-card.component.html',
  styleUrls: ['./mining-card.component.scss']
})
export class MiningCardComponent {
  @Input() pool: ILiquidityPoolSummaryResponse;

  constructor(private _sidebar: SidenavService) { }

  startMining() {
    this._sidebar.openSidenav(SidenavView.mine, {pool: this.pool, child: 'start'});
  }

  stopMining() {
    this._sidebar.openSidenav(SidenavView.mine, {pool: this.pool, child: 'stop'});
  }
}
