import { IStopMiningEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/mining-pools/stop-mining-event.interface';
import { IStartMiningEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/mining-pools/start-mining-event.interface';
import { ICollectMiningRewardsEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/mining-pools/collect-mining-rewards-event.interface';
import { MiningPoolsService } from '@sharedServices/platform/mining-pools.service';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ILiquidityPoolSummary, IMiningPool } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'opdex-mine-transaction-summary',
  templateUrl: './mine-transaction-summary.component.html',
  styleUrls: ['./mine-transaction-summary.component.scss']
})
export class MineTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  isAddition: boolean;
  lptAmount: FixedDecimal;
  collectAmount: FixedDecimal;
  pool: ILiquidityPoolSummary;
  subscription = new Subscription();
  error: string;
  eventTypes = [
    TransactionEventTypes.StartMiningEvent,
    TransactionEventTypes.StopMiningEvent,
    TransactionEventTypes.CollectMiningRewardsEvent
  ]

  constructor(
    private _liquidityPoolService: LiquidityPoolsService,
    private _miningPoolService: MiningPoolsService
  ) { }

  ngOnChanges(): void {
    const mineEvents = this.transaction.events.filter(event => this.eventTypes.includes(event.eventType));

    var collectEvent = mineEvents.find(event => event.eventType === TransactionEventTypes.CollectMiningRewardsEvent) as ICollectMiningRewardsEvent;
    var startEvent = mineEvents.find(event => event.eventType === TransactionEventTypes.StartMiningEvent) as IStartMiningEvent;
    var stopEvent = mineEvents.find(event => event.eventType === TransactionEventTypes.StopMiningEvent) as IStopMiningEvent;

    if (mineEvents.length > 2 || mineEvents.length === 0 || (!collectEvent && !startEvent && !stopEvent)) {
      this.error = 'Unable to read mine transaction.';
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = new Subscription();

    this.subscription.add(
      this._miningPoolService.getMiningPool(startEvent?.contract || stopEvent?.contract || collectEvent?.contract)
        .pipe(switchMap((miningPool: IMiningPool) => this._liquidityPoolService.getLiquidityPool(miningPool.liquidityPool, true)))
        .subscribe((liquidityPool: ILiquidityPoolSummary) => {
          this.pool = liquidityPool;

          const collectAmount = collectEvent === undefined ? '0' : collectEvent.amount;
          this.collectAmount = new FixedDecimal(collectAmount, liquidityPool.token.staking.decimals);

          let lptAmount = new FixedDecimal('0', liquidityPool.token.lp.decimals);

          if (startEvent !== undefined) {
            this.isAddition = true;
            lptAmount = new FixedDecimal(startEvent.amount, liquidityPool.token.lp.decimals);
          }
          else if (stopEvent !== undefined) {
            this.isAddition = false;
            lptAmount = new FixedDecimal(stopEvent.amount, liquidityPool.token.lp.decimals);
          }

          this.lptAmount = lptAmount;
        }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}