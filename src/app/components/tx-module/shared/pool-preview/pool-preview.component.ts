import { SidenavView } from './../../../../models/sidenav-view';
import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-pool-preview',
  templateUrl: './pool-preview.component.html',
  styleUrls: ['./pool-preview.component.scss']
})
export class PoolPreviewComponent {
  @Input() pool: ILiquidityPoolSummaryResponse;
  @Input() view: SidenavView;

  get showStaking() {
    return this.view === SidenavView.stake;
  }

  get showMining() {
    return this.view === SidenavView.mine;
  }

  get showReserves() {
    return this.view === SidenavView.swap || this.view === SidenavView.pool;
  }

  clearPool() {
    this.pool = null;
  }
}
