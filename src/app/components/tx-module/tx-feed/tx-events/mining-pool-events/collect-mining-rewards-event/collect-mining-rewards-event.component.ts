import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse, ICollectMiningRewardsEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { LiquidityPoolService } from '@sharedServices/liquidity-pool.service';
import { TokenService } from '@sharedServices/token.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-collect-mining-rewards-event',
  templateUrl: './collect-mining-rewards-event.component.html',
  styleUrls: ['./collect-mining-rewards-event.component.scss']
})
export class CollectMiningRewardsEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: ICollectMiningRewardsEventResponse;
  pool$: Observable<ILiquidityPoolSummaryResponse>;

  constructor(protected _liquidityPoolService: LiquidityPoolService, protected _tokenService: TokenService) {
    super(_liquidityPoolService, _tokenService);
  }

  ngOnChanges() {
    this.event = this.txEvent as ICollectMiningRewardsEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
