import { Component, Input, OnInit } from '@angular/core';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { ISetPendingMarketOwnershipEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/markets/set-pending-market-ownership-event.interfac';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { MarketsService } from '@sharedServices/platform/markets.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-set-pending-market-owner-event',
  templateUrl: './set-pending-market-owner-event.component.html',
  styleUrls: ['./set-pending-market-owner-event.component.scss']
})
export class SetPendingMarketOwnerEventComponent extends TxEventBaseComponent {

   @Input() txEvent: ITransactionEvent;
  event: ISetPendingMarketOwnershipEvent;
  pool$: Observable<ILiquidityPoolSummary>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as ISetPendingMarketOwnershipEvent;
    this.pool$ = this.getLiquidityPool$(this.txEvent.contract);
  }

}
