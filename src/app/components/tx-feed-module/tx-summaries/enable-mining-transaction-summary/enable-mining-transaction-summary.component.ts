import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { take } from 'rxjs/operators';
import { IRewardMiningPoolEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/governances/reward-mining-pool-event.interface';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { combineLatest, Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { Token } from '@sharedModels/ui/tokens/token';

@Component({
  selector: 'opdex-enable-mining-transaction-summary',
  templateUrl: './enable-mining-transaction-summary.component.html',
  styleUrls: ['./enable-mining-transaction-summary.component.scss']
})
export class EnableMiningTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  poolAmount: FixedDecimal;
  pools: LiquidityPool[];
  stakingToken: Token;
  subscription = new Subscription();
  error: string;
  eventTypes = [
    TransactionEventTypes.RewardMiningPoolEvent,
  ]

  constructor(private _liquidityPoolService: LiquidityPoolsService) { }

  ngOnChanges(): void {
    const rewardEvents = this.transaction.events.filter(event => this.eventTypes.includes(event.eventType)) as IRewardMiningPoolEvent[];

    if (rewardEvents.length > 4 || rewardEvents.length === 0) {
      this.error = 'Unable to read enable mining transaction.';
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = new Subscription();

    this.subscription.add(
      combineLatest(rewardEvents.map(event => this._liquidityPoolService.getLiquidityPool(event.stakingPool)))
        .pipe(take(1))
        .subscribe((pools: LiquidityPool[]) => {
          this.pools = pools;
          this.poolAmount = new FixedDecimal(rewardEvents[0].amount, pools[0].summary?.staking?.token?.decimals);
          this.stakingToken = pools[0].summary.staking?.token;
        }));
  }

  poolsTrackBy(index: number, pool: LiquidityPool) {
    if (!!pool === false) return index;
    return `${index}-${pool.address}-${pool.summary.cost.crsPerSrc.formattedValue}-${pool.miningPool?.tokensMining.formattedValue}-${pool.summary.staking?.weight.formattedValue}`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
