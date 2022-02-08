import { Component, Injector, Input } from '@angular/core';
import { TxEventBaseComponent } from '../../tx-event-base.component';
import { Observable } from 'rxjs';
import { ICollectStakingRewardsEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/liquidity-pools/staking/collect-staking-rewards.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

@Component({
  selector: 'opdex-collect-staking-rewards-event',
  templateUrl: './collect-staking-rewards-event.component.html',
  styleUrls: ['./collect-staking-rewards-event.component.scss']
})
export class CollectStakingRewardsEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: ICollectStakingRewardsEvent;
  pool$: Observable<LiquidityPool>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as ICollectStakingRewardsEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
