import { Component, Injector, Input } from '@angular/core';
import { IStopStakingEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/staking/stop-staking-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-stop-staking-event',
  templateUrl: './stop-staking-event.component.html',
  styleUrls: ['./stop-staking-event.component.scss']
})
export class StopStakingEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IStopStakingEvent;
  pool$: Observable<LiquidityPool>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IStopStakingEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
