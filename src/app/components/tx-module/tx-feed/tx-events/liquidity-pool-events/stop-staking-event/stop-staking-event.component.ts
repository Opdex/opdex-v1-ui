import { Component, Injector, Input } from '@angular/core';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { IStopStakingEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/staking/stop-staking-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
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
  pool$: Observable<ILiquidityPoolSummary>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IStopStakingEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
