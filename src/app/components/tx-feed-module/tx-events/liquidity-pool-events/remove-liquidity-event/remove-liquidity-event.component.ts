import { Component, Injector, Input } from '@angular/core';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { IRemoveLiquidityEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/remove-liquidity-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
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
  pool$: Observable<ILiquidityPoolResponse>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IRemoveLiquidityEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
