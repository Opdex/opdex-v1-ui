import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { IRemoveLiquidityEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/liquidity-pools/remove-liquidity-event.interfac';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-remove-liquidity-event',
  templateUrl: './remove-liquidity-event.component.html',
  styleUrls: ['./remove-liquidity-event.component.scss']
})
export class RemoveLiquidityEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IRemoveLiquidityEvent;
  pool$: Observable<ILiquidityPoolSummary>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IRemoveLiquidityEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
