import { Component, Input } from '@angular/core';
import { TxEventBaseComponent } from '../../tx-event-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { Observable } from 'rxjs';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
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

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as ICollectStakingRewardsEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
