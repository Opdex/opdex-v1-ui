import { Icons } from 'src/app/enums/icons';
import { ICreateLiquidityPoolEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/markets/create-liquidity-pool-event.interface';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';

@Component({
  selector: 'opdex-create-pool-transaction-summary',
  templateUrl: './create-pool-transaction-summary.component.html',
  styleUrls: ['./create-pool-transaction-summary.component.scss']
})
export class CreatePoolTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  icons = Icons;
  pool: ILiquidityPoolResponse;
  subscription = new Subscription();
  error: string;
  eventTypes = [
    TransactionEventTypes.CreateLiquidityPoolEvent,
  ]

  constructor(private _liquidityPoolService: LiquidityPoolsService) { }

  ngOnChanges(): void {
    const createEvents = this.transaction.events.filter(event => this.eventTypes.includes(event.eventType)) as ICreateLiquidityPoolEvent[];

    if (createEvents[0] === undefined) {
      this.error = 'Oops, something is wrong.';
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = new Subscription();

    this.subscription.add(
      this._liquidityPoolService.getLiquidityPool(createEvents[0].liquidityPool, true)
        .subscribe(
          (pool: ILiquidityPoolResponse) => this.pool = pool,
          (error: string) => this.error = 'Oops, something is wrong.'));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
