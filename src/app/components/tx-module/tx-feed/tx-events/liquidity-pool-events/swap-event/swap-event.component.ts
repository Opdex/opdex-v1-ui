import { Component, Injector, Input } from '@angular/core';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { ISwapEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/liquidity-pools/swap-event.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-swap-event',
  templateUrl: './swap-event.component.html',
  styleUrls: ['./swap-event.component.scss']
})
export class SwapEventComponent  extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: ISwapEvent;
  pool$: Observable<ILiquidityPoolSummary>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as ISwapEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
