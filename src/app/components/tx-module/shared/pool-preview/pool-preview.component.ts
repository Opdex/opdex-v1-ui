import { TransactionView } from '@sharedModels/transaction-view';
import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-pool-preview',
  templateUrl: './pool-preview.component.html',
  styleUrls: ['./pool-preview.component.scss']
})
export class PoolPreviewComponent {
  @Input() pool: ILiquidityPoolSummaryResponse;
  @Input() view: TransactionView;

  get showStaking() {
    return this.view === TransactionView.stake;
  }

  get showMining() {
    return this.view === TransactionView.mine;
  }

  get showReserves() {
    return this.view === TransactionView.swap || this.view === TransactionView.provide;
  }

  clearPool() {
    this.pool = null;
  }
}
