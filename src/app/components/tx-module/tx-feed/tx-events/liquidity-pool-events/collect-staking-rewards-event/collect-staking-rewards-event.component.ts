import { Component, Injector, Input } from '@angular/core';
import { TxEventBaseComponent } from '../../tx-event-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { Observable } from 'rxjs';
import { ICollectStakingRewardsEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/liquidity-pools/staking/collect-staking-rewards.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-collect-staking-rewards-event',
  templateUrl: './collect-staking-rewards-event.component.html',
  styleUrls: ['./collect-staking-rewards-event.component.scss']
})
export class CollectStakingRewardsEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: ICollectStakingRewardsEvent;
  pool$: Observable<ILiquidityPoolSummary>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as ICollectStakingRewardsEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
