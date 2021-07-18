import { Component, Input, OnInit } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse, INominationEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-nomination-event',
  templateUrl: './nomination-event.component.html',
  styleUrls: ['./nomination-event.component.scss']
})
export class NominationEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: INominationEventResponse;
  pool$: Observable<ILiquidityPoolSummaryResponse>;

  constructor(protected _platformApi: PlatformApiService) {
    super(_platformApi);
  }

  ngOnChanges() {
    this.event = this.txEvent as INominationEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.stakingPool);
  }
}
