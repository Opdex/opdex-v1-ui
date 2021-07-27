import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse, IStakeEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { LiquidityPoolService } from '@sharedServices/liquidity-pool.service';
import { TokenService } from '@sharedServices/token.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-stake-event',
  templateUrl: './stake-event.component.html',
  styleUrls: ['./stake-event.component.scss']
})
export class StakeEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: IStakeEventResponse;
  pool$: Observable<ILiquidityPoolSummaryResponse>;

  constructor(protected _liquidityPoolService: LiquidityPoolService, protected _tokenService: TokenService) {
    super(_liquidityPoolService, _tokenService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IStakeEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
