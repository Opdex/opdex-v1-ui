import { LiquidityPoolService } from '@sharedServices/liquidity-pool.service';
import { TokenService } from '@sharedServices/token.service';
import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse, INominationEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
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

  constructor(protected _liquidityPoolService: LiquidityPoolService, protected _tokenService: TokenService) {
    super(_liquidityPoolService, _tokenService);
  }

  ngOnChanges() {
    this.event = this.txEvent as INominationEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.stakingPool);
  }
}
