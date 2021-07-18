import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse, IProvideEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-provide-event',
  templateUrl: './provide-event.component.html',
  styleUrls: ['./provide-event.component.scss']
})
export class ProvideEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: IProvideEventResponse;
  pool$: Observable<ILiquidityPoolSummaryResponse>;

  constructor(protected _platformApi: PlatformApiService) {
    super(_platformApi);
  }

  ngOnChanges() {
    console.log(this.txEvent)
    this.event = this.txEvent as IProvideEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
