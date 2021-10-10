import { Component, Injector, Input } from '@angular/core';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { IAddLiquidityEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/add-liquidity-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-add-liquidity-event',
  templateUrl: './add-liquidity-event.component.html',
  styleUrls: ['./add-liquidity-event.component.scss']
})
export class AddLiquidityEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IAddLiquidityEvent;
  pool$: Observable<ILiquidityPoolSummary>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IAddLiquidityEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
