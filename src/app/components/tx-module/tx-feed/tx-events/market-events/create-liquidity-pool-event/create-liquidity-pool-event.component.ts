import { Component, Injector, Input } from '@angular/core';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { ICreateLiquidityPoolEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/markets/create-liquidity-pool-event.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-create-liquidity-pool-event',
  templateUrl: './create-liquidity-pool-event.component.html',
  styleUrls: ['./create-liquidity-pool-event.component.scss']
})
export class CreateLiquidityPoolEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: ICreateLiquidityPoolEvent;
  pool$: Observable<ILiquidityPoolSummary>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as ICreateLiquidityPoolEvent;
    this.pool$ = this.getLiquidityPool$(this.event.liquidityPool);
  }
}
