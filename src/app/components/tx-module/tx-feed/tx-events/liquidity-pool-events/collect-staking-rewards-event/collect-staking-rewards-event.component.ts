import { ITransactionEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Input } from '@angular/core';
import { ICollectStakingRewardsEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { TxEventBaseComponent } from '../../tx-event-base.component';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-collect-staking-rewards-event',
  templateUrl: './collect-staking-rewards-event.component.html',
  styleUrls: ['./collect-staking-rewards-event.component.scss']
})
export class CollectStakingRewardsEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: ICollectStakingRewardsEventResponse;
  pool$: Observable<ILiquidityPoolSummaryResponse>;

  constructor(protected _platformApi: PlatformApiService) {
    super(_platformApi);
  }

  ngOnChanges() {
    this.event = this.txEvent as ICollectStakingRewardsEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
