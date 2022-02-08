import { switchMap } from 'rxjs/operators';
import { Component, Injector, Input } from '@angular/core';
import { IEnableMiningEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/mining-pools/enable-mining-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { MiningPoolsService } from '@sharedServices/platform/mining-pools.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { IMiningPool } from '@sharedModels/platform-api/responses/mining-pools/mining-pool.interface';

@Component({
  selector: 'opdex-enable-mining-event',
  templateUrl: './enable-mining-event.component.html',
  styleUrls: ['./enable-mining-event.component.scss']
})
export class EnableMiningEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IEnableMiningEvent;
  pool$: Observable<LiquidityPool>;

  constructor(protected injector: Injector, private _miningPoolService: MiningPoolsService) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IEnableMiningEvent;
    this.pool$ = this._miningPoolService.getMiningPool(this.event.contract)
      .pipe(switchMap((miningPool: IMiningPool) => this._liquidityPoolsService.getLiquidityPool(miningPool.liquidityPool)));
  }
}
