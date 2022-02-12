import { Token } from '@sharedModels/ui/tokens/token';
import { take } from 'rxjs/operators';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { ISwapEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/swap-event.interface';
import { combineLatest, Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { TransactionReceipt } from '@sharedModels/ui/transactions/transaction-receipt';
import { Component, Input, OnDestroy, OnChanges } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

@Component({
  selector: 'opdex-swap-transaction-summary',
  templateUrl: './swap-transaction-summary.component.html',
  styleUrls: ['./swap-transaction-summary.component.scss']
})
export class SwapTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  tokenIn: Token;
  tokenOut: Token;
  tokenInAmount: FixedDecimal;
  tokenOutAmount: FixedDecimal;
  subscription = new Subscription();
  error: string;

  constructor(private _liquidityPoolService: LiquidityPoolsService) { }

  ngOnChanges(): void {
    const swapEvents = this.transaction.events.filter(event => event.eventType === TransactionEventTypes.SwapEvent) as ISwapEvent[];

    if (swapEvents.length == 0 || swapEvents.length > 2) {
      this.error = 'Unable to read swap transaction.'
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = new Subscription();

    if (swapEvents.length === 1) {
      const event = swapEvents[0];

      this.subscription.add(
        this._liquidityPoolService.getLiquidityPool(event.contract)
          .pipe(
            take(1),
            tap((pool: LiquidityPool) => {
            const crsIn = new FixedDecimal(event.amountCrsIn, 8);

            this.tokenIn = crsIn.isZero ? pool.tokens.src : pool.tokens.crs;
            this.tokenOut = crsIn.isZero ? pool.tokens.crs : pool.tokens.src;

            const tokenInAmount = crsIn.isZero ? event.amountSrcIn : event.amountCrsIn;
            this.tokenInAmount = new FixedDecimal(tokenInAmount, this.tokenIn.decimals);

            const tokenOutAmount = crsIn.isZero ? event.amountCrsOut : event.amountSrcOut;
            this.tokenOutAmount = new FixedDecimal(tokenOutAmount, this.tokenOut.decimals);
          })).subscribe());
    }
    else if (swapEvents.length === 2) {
      const firstEvent = swapEvents[0];
      const secondEvent = swapEvents[1];
      this.subscription.add(
        combineLatest([
          this._liquidityPoolService.getLiquidityPool(firstEvent.contract),
          this._liquidityPoolService.getLiquidityPool(secondEvent.contract)
        ])
        .pipe(take(1))
        .subscribe(([firstPool, secondPool]: [LiquidityPool, LiquidityPool]) => {
          this.tokenIn = firstPool.tokens.src;
          this.tokenOut = secondPool.tokens.src;
          this.tokenInAmount = new FixedDecimal(firstEvent.amountSrcIn, this.tokenIn.decimals);
          this.tokenOutAmount = new FixedDecimal(secondEvent.amountSrcOut, this.tokenOut.decimals);
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
