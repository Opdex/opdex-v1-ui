import { take } from 'rxjs/operators';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IRewardMiningPoolEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/governances/reward-mining-pool-event.interface';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { combineLatest, Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';

@Component({
  selector: 'opdex-enable-mining-transaction-summary',
  templateUrl: './enable-mining-transaction-summary.component.html',
  styleUrls: ['./enable-mining-transaction-summary.component.scss']
})
export class EnableMiningTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  poolAmount: FixedDecimal;
  pools: ILiquidityPoolResponse[];
  stakingToken: IToken;
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
        .subscribe((pools: ILiquidityPoolResponse[]) => {
          this.pools = pools;
          this.poolAmount = new FixedDecimal(rewardEvents[0].amount, pools[0].summary?.staking?.token?.decimals);
          this.stakingToken = pools[0].summary.staking?.token;
        }));
  }

  poolsTrackBy(index: number, pool: ILiquidityPoolResponse) {
    if (pool === null || pool === undefined) return index;
    return `${index}-${pool.address}-${pool.summary.cost.crsPerSrc}-${pool.summary.miningPool?.tokensMining}-${pool.summary.staking?.weight}`;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
