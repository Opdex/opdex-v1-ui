import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Component, Input } from '@angular/core';
import { TransactionView } from '@sharedModels/transaction-view';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-mining-card',
  templateUrl: './mining-card.component.html',
  styleUrls: ['./mining-card.component.scss']
})
export class MiningCardComponent {
  @Input() pool: ILiquidityPoolSummary;

  constructor(private _sidebar: SidenavService) { }

  startMining() {
    this._sidebar.openSidenav(TransactionView.mine, {pool: this.pool, child: 'start'});
  }

  stopMining() {
    this._sidebar.openSidenav(TransactionView.mine, {pool: this.pool, child: 'stop'});
  }

  collect() {
    this._sidebar.openSidenav(TransactionView.mine, {pool: this.pool, child: 'collect'});
  }
}
