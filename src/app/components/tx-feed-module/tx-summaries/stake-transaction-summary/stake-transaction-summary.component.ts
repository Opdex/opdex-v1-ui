import { Token } from '@sharedModels/ui/tokens/token';
import { IRemoveLiquidityEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/remove-liquidity-event.interface';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ICollectStakingRewardsEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/staking/collect-staking-rewards.interface';
import { IStartStakingEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/staking/start-staking-event.interface';
import { IStopStakingEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/staking/stop-staking-event.interface';
import { TransactionReceipt } from '@sharedModels/ui/transactions/transaction-receipt';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { take } from 'rxjs/operators';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

@Component({
  selector: 'opdex-stake-transaction-summary',
  templateUrl: './stake-transaction-summary.component.html',
  styleUrls: ['./stake-transaction-summary.component.scss']
})
export class StakeTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  isAddition: boolean;
  isCollection: boolean;
  collectionLiquidatedRewards: boolean;
  stakingAmount: FixedDecimal;
  amountOneToken: Token;
  amountTwoToken: Token;
  collectAmountOne: FixedDecimal; // Could be OLPT, or if liquidated, CRS
  collectAmountTwo: FixedDecimal; // If liquidated, SRC
  pool: LiquidityPool;
  subscription = new Subscription();
  error: string;
  eventTypes = [
    TransactionEventTypes.StartStakingEvent,
    TransactionEventTypes.StopStakingEvent,
    TransactionEventTypes.CollectStakingRewardsEvent,
    TransactionEventTypes.RemoveLiquidityEvent
  ]

  constructor(
    private _liquidityPoolService: LiquidityPoolsService
  ) { }

  ngOnChanges(): void {
    const stakeEvents = this.transaction.events.filter(event => this.eventTypes.includes(event.eventType));

    var startEvent = stakeEvents.find(event => event.eventType === TransactionEventTypes.StartStakingEvent) as IStartStakingEvent;
    var stopEvent = stakeEvents.find(event => event.eventType === TransactionEventTypes.StopStakingEvent) as IStopStakingEvent;
    var collectEvent = stakeEvents.find(event => event.eventType === TransactionEventTypes.CollectStakingRewardsEvent) as ICollectStakingRewardsEvent;
    var burnEvent = stakeEvents.find(event => event.eventType === TransactionEventTypes.RemoveLiquidityEvent) as IRemoveLiquidityEvent;

    if (stakeEvents.length > 4 || stakeEvents.length === 0 || (!collectEvent && !startEvent && !stopEvent)) {
      this.error = 'Unable to read stake transaction.';
      return;
    }

    // Todo: could be collection only...
    this.isAddition = startEvent !== undefined;
    this.isCollection = collectEvent !== undefined;
    this.collectionLiquidatedRewards = this.isCollection && burnEvent !== undefined;

    this.subscription.unsubscribe();
    this.subscription = new Subscription();

    this.subscription.add(
      this._liquidityPoolService.getLiquidityPool(startEvent?.contract || stopEvent?.contract || collectEvent?.contract)
      .pipe(take(1))
      .subscribe((liquidityPool: LiquidityPool) => {
          this.pool = liquidityPool;

          const stakingAmount = startEvent?.amount || stopEvent?.amount || '0';
          this.stakingAmount = new FixedDecimal(stakingAmount, liquidityPool.summary.staking?.token.decimals);

          if (this.isCollection) {
            if (this.collectionLiquidatedRewards) {
              this.amountOneToken = liquidityPool.tokens.crs;
              this.amountTwoToken = liquidityPool.tokens.src;

              const amountOne = burnEvent.amountCrs;
              const amountTwo = burnEvent.amountSrc;
              this.collectAmountOne = new FixedDecimal(amountOne, this.amountOneToken.decimals);
              this.collectAmountTwo = new FixedDecimal(amountTwo, this.amountTwoToken.decimals);
            } else {
              this.amountOneToken = liquidityPool.tokens.lp;
              this.collectAmountOne = new FixedDecimal(collectEvent.amount, this.amountOneToken.decimals);
            }
          }
        }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
