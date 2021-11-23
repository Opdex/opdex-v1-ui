import { Component, Injector, Input } from '@angular/core';
import { ILiquidityPoolResponse, IMiningPool } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { ICollectMiningRewardsEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/mining-pools/collect-mining-rewards-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { MiningPoolsService } from '@sharedServices/platform/mining-pools.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-collect-mining-rewards-event',
  templateUrl: './collect-mining-rewards-event.component.html',
  styleUrls: ['./collect-mining-rewards-event.component.scss']
})
export class CollectMiningRewardsEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: ICollectMiningRewardsEvent;
  pool$: Observable<ILiquidityPoolResponse>;

  constructor(protected injector: Injector, private _miningPoolService: MiningPoolsService) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as ICollectMiningRewardsEvent;
    this.pool$ = this._miningPoolService.getMiningPool(this.event.contract)
      .pipe(switchMap((miningPool: IMiningPool) => this._liquidityPoolsService.getLiquidityPool(miningPool.liquidityPool)));
  }
}
