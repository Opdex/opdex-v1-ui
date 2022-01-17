import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { Component, Input, OnChanges } from '@angular/core';
import { TransactionView } from '@sharedModels/transaction-view';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';

@Component({
  selector: 'opdex-mining-card',
  templateUrl: './mining-card.component.html',
  styleUrls: ['./mining-card.component.scss']
})
export class MiningCardComponent implements OnChanges {
  @Input() pool: ILiquidityPoolResponse;
  miningUsd: string;
  icons = Icons;
  iconSizes = IconSizes;

  constructor(private _sidebar: SidenavService) { }

  ngOnChanges() {
    this.miningUsd = MathService.multiply(
      new FixedDecimal(this.pool.miningPool.tokensMining, this.pool.token.lp.decimals),
      new FixedDecimal(this.pool.token.lp.summary.priceUsd.toString(), 8));
  }

  transact(childView: string) {
    this._sidebar.openSidenav(TransactionView.mine, {pool: this.pool, child: childView});
  }
}
