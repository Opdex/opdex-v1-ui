import { Component, Injector, Input } from '@angular/core';
import { ILiquidityPoolResponse, IMiningPool } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { IStopMiningEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/mining-pools/stop-mining-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { MiningPoolsService } from '@sharedServices/platform/mining-pools.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-stop-mining-event',
  templateUrl: './stop-mining-event.component.html',
  styleUrls: ['./stop-mining-event.component.scss']
})
export class StopMiningEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IStopMiningEvent;
  pool$: Observable<ILiquidityPoolResponse>;

  constructor(protected injector: Injector, private _miningPoolService: MiningPoolsService) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IStopMiningEvent;
    this.pool$ = this._miningPoolService.getMiningPool(this.event.contract)
      .pipe(switchMap((miningPool: IMiningPool) => this._liquidityPoolsService.getLiquidityPool(miningPool.liquidityPool)));
  }
}
