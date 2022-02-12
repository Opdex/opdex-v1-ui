import { Component, Injector, Input } from '@angular/core';
import { IMiningPool } from '@sharedModels/platform-api/responses/mining-pools/mining-pool.interface';
import { IStartMiningEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/mining-pools/start-mining-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { MiningPoolsService } from '@sharedServices/platform/mining-pools.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-start-mining-event',
  templateUrl: './start-mining-event.component.html',
  styleUrls: ['./start-mining-event.component.scss']
})
export class StartMiningEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IStartMiningEvent;
  pool$: Observable<LiquidityPool>;

  constructor(protected injector: Injector, private _miningPoolService: MiningPoolsService) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IStartMiningEvent;
    this.pool$ = this._miningPoolService.getMiningPool(this.event.contract)
      .pipe(switchMap((miningPool: IMiningPool) => this._liquidityPoolsService.getLiquidityPool(miningPool.liquidityPool)));
  }
}
