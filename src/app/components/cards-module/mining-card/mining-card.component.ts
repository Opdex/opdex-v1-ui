import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Component, Input, OnChanges } from '@angular/core';
import { TransactionView } from '@sharedModels/transaction-view';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';

@Component({
  selector: 'opdex-mining-card',
  templateUrl: './mining-card.component.html',
  styleUrls: ['./mining-card.component.scss']
})
export class MiningCardComponent implements OnChanges {
  @Input() pool: LiquidityPool;
  miningUsd: FixedDecimal;
  icons = Icons;
  iconSizes = IconSizes;

  constructor(private _sidebar: SidenavService) { }

  ngOnChanges() {
    if (!!this.pool.miningPool === false) return;

    this.miningUsd = this.pool.tokens.lp.summary.priceUsd.multiply(this.pool.miningPool.tokensMining);
  }

  transact(childView: string) {
    this._sidebar.openSidenav(TransactionView.mine, {pool: this.pool, child: childView});
  }
}
