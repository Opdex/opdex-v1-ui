import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Subscription } from 'rxjs';
import { IndexService } from '@sharedServices/platform/index.service';
import { Icons } from 'src/app/enums/icons';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'opdex-liquidity-pool-summary-card',
  templateUrl: './liquidity-pool-summary-card.component.html',
  styleUrls: ['./liquidity-pool-summary-card.component.scss']
})
export class LiquidityPoolSummaryCardComponent implements OnDestroy {
  @Input() pool: LiquidityPool;
  @Input() showPoolName: boolean;
  latestBlock: number;
  icons = Icons;
  subscription = new Subscription();
  one = FixedDecimal.One(0);

  public get miningUsd(): FixedDecimal {
    if (!!this.pool?.miningPool === false) return FixedDecimal.Zero(0);

    const { priceUsd } = this.pool.tokens.lp.summary;
    const { tokensMining } = this.pool.miningPool;

    return priceUsd.multiply(tokensMining);
  }

  constructor(private _indexService: IndexService) {
    this.subscription.add(
      this._indexService.latestBlock$
        .subscribe(block => this.latestBlock = block.height));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
