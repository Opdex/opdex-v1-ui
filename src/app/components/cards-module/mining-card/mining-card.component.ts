import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Component, Input, OnChanges } from '@angular/core';
import { TransactionView } from '@sharedModels/transaction-view';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-mining-card',
  templateUrl: './mining-card.component.html',
  styleUrls: ['./mining-card.component.scss']
})
export class MiningCardComponent implements OnChanges {
  @Input() pool: ILiquidityPoolSummary;
  miningUsd: string;

  constructor(private _sidebar: SidenavService) { }

  ngOnChanges() {
    this.miningUsd = MathService.multiply(
      new FixedDecimal(this.pool.mining.tokensMining, this.pool.token.lp.decimals),
      new FixedDecimal(this.pool.token.lp.summary.priceUsd.toString(), 8));
  }

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
