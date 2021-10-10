import { Component, Injector, Input } from '@angular/core';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { IStartStakingEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/staking/start-staking-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-start-staking-event',
  templateUrl: './start-staking-event.component.html',
  styleUrls: ['./start-staking-event.component.scss']
})
export class StartStakingEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IStartStakingEvent;
  pool$: Observable<ILiquidityPoolSummary>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IStartStakingEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
