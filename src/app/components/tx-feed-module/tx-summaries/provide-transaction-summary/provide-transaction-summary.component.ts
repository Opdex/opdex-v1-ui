import { IRemoveLiquidityEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/remove-liquidity-event.interface';
import { IAddLiquidityEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/add-liquidity-event.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { TransactionReceipt } from '@sharedModels/ui/transactions/transaction-receipt';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { take } from 'rxjs/operators';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

@Component({
  selector: 'opdex-provide-transaction-summary',
  templateUrl: './provide-transaction-summary.component.html',
  styleUrls: ['./provide-transaction-summary.component.scss']
})
export class ProvideTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  isAddition: boolean;
  lptAmount: FixedDecimal;
  crsAmount: FixedDecimal;
  srcAmount: FixedDecimal;
  pool: LiquidityPool;
  subscription = new Subscription();
  error: string;
  transactionSummary: string;
  eventTypes = [
    TransactionEventTypes.AddLiquidityEvent,
    TransactionEventTypes.RemoveLiquidityEvent
  ]

  constructor(private _liquidityPoolService: LiquidityPoolsService) { }

  ngOnChanges(): void {
    // Should only be one
    const provideEvents = this.transaction.events
      .filter(event => this.eventTypes.includes(event.eventType));

    if (provideEvents.length > 1 || provideEvents.length === 0) {
      this.error = 'Unable to read provide transaction.';
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = new Subscription();

    this.subscription.add(
      this._liquidityPoolService.getLiquidityPool(provideEvents[0].contract)
      .pipe(take(1))
      .subscribe((pool: LiquidityPool) => {
        if (provideEvents[0].eventType === TransactionEventTypes.AddLiquidityEvent) {
          const event = provideEvents[0] as IAddLiquidityEvent;
          this.isAddition = true;
          this.lptAmount = new FixedDecimal(event.amountLpt, pool.tokens.lp.decimals);
          this.srcAmount = new FixedDecimal(event.amountSrc, pool.tokens.src.decimals);
          this.crsAmount = new FixedDecimal(event.amountCrs, pool.tokens.crs.decimals);
        } else {
          const event = provideEvents[0] as IRemoveLiquidityEvent;
          this.isAddition = false;
          this.lptAmount = new FixedDecimal(event.amountLpt, pool.tokens.lp.decimals);
          this.srcAmount = new FixedDecimal(event.amountSrc, pool.tokens.src.decimals);
          this.crsAmount = new FixedDecimal(event.amountCrs, pool.tokens.crs.decimals);
        }

        this.pool = pool;
      }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
