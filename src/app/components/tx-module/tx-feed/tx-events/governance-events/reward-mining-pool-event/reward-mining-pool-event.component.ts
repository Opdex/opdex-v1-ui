import { Observable } from 'rxjs';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { IRewardMiningPoolEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/governances/reward-mining-pool-event.interface';
import { Component, Input, Injector } from '@angular/core';
import { TxEventBaseComponent } from '../../tx-event-base.component';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-reward-mining-pool-event',
  templateUrl: './reward-mining-pool-event.component.html',
  styleUrls: ['./reward-mining-pool-event.component.scss']
})
export class RewardMiningPoolEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IRewardMiningPoolEvent;
  pool$: Observable<ILiquidityPoolSummary>;

  constructor(protected _injector: Injector) {
    super(_injector);
  }

  ngOnInit(): void {
    this.event = this.txEvent as IRewardMiningPoolEvent;
    this.pool$ = this._liquidityPoolsService.getLiquidityPool(this.event.stakingPool);
  }
}
