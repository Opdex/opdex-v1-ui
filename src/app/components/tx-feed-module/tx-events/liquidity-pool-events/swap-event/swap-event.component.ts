import { Component, Injector, Input } from '@angular/core';
import { ISwapEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/swap-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
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
  pool$: Observable<LiquidityPool>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as ISwapEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
