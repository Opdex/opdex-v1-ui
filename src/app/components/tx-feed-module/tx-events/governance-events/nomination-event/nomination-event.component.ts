import { Component, Injector, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';
import { INominationEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/governances/nomination-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

@Component({
  selector: 'opdex-nomination-event',
  templateUrl: './nomination-event.component.html',
  styleUrls: ['./nomination-event.component.scss']
})
export class NominationEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: INominationEvent;
  pool$: Observable<LiquidityPool>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as INominationEvent;
    this.pool$ = this.getLiquidityPool$(this.event.stakingPool);
  }
}
