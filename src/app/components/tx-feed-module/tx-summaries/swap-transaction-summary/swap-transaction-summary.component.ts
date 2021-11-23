import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { ISwapEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/swap-event.interface';
import { combineLatest, Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { Component, Input, OnDestroy, OnChanges } from '@angular/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-swap-transaction-summary',
  templateUrl: './swap-transaction-summary.component.html',
  styleUrls: ['./swap-transaction-summary.component.scss']
})
export class SwapTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  tokenIn: IToken;
  tokenOut: IToken;
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
        this._liquidityPoolService.getLiquidityPool(event.contract, true)
          .pipe(tap((pool: ILiquidityPoolResponse) => {
            const crsIn = new FixedDecimal(event.amountCrsIn, 8);

            this.tokenIn = crsIn.isZero ? pool.token.src : pool.token.crs;
            this.tokenOut = crsIn.isZero ? pool.token.crs : pool.token.src;

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
          this._liquidityPoolService.getLiquidityPool(firstEvent.contract, true),
          this._liquidityPoolService.getLiquidityPool(secondEvent.contract, true)
        ]).subscribe(([firstPool, secondPool]: [ILiquidityPoolResponse, ILiquidityPoolResponse]) => {
          this.tokenIn = firstPool.token.src;
          this.tokenOut = secondPool.token.src;
          this.tokenInAmount = new FixedDecimal(firstEvent.amountSrcIn, this.tokenIn.decimals);
          this.tokenOutAmount = new FixedDecimal(secondEvent.amountSrcOut, this.tokenOut.decimals);
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
