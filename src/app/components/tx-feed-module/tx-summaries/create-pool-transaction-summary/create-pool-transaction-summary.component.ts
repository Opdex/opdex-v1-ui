import { Token } from '@sharedModels/ui/tokens/token';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Icons } from 'src/app/enums/icons';
import { ICreateLiquidityPoolEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/markets/create-liquidity-pool-event.interface';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { TransactionReceipt } from '@sharedModels/ui/transactions/transaction-receipt';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Subscription } from 'rxjs';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-create-pool-transaction-summary',
  templateUrl: './create-pool-transaction-summary.component.html',
  styleUrls: ['./create-pool-transaction-summary.component.scss']
})
export class CreatePoolTransactionSummaryComponent implements OnChanges, OnDestroy {
  @Input() transaction: TransactionReceipt;

  icons = Icons;
  pool: LiquidityPool;
  crs: Token;
  src: Token;
  subscription = new Subscription();
  error: string;
  isQuote: boolean;
  eventTypes = [
    TransactionEventTypes.CreateLiquidityPoolEvent,
  ]

  constructor(private _liquidityPoolService: LiquidityPoolsService, private _tokenService: TokensService) { }

  ngOnChanges(): void {
    this.isQuote = this.transaction.hash?.length === 0;
    const createEvents = this.transaction.events.filter(event => this.eventTypes.includes(event.eventType)) as ICreateLiquidityPoolEvent[];

    if (createEvents[0] === undefined) {
      this.error = 'Oops, something is wrong.';
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = new Subscription();

    if (this.isQuote) {
      this.subscription.add(
        this._tokenService.getToken(createEvents[0].token)
        .pipe(
          take(1),
          tap(token => this.src = token),
          switchMap(_ => this._tokenService.getToken('CRS'))
        ).subscribe(
          (token) => this.crs = token,
          (error: string) => this.error = 'Oops, something is wrong.'));
    } else {
      this.subscription.add(
        this._liquidityPoolService.getLiquidityPool(createEvents[0].liquidityPool)
          .pipe(take(1))
          .subscribe(
            (pool: LiquidityPool) => this.pool = pool,
            (error: string) => this.error = 'Oops, something is wrong.'));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
