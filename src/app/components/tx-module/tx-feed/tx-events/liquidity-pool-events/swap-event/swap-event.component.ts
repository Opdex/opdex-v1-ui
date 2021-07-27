import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ISwapEventResponse, ITransactionEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { LiquidityPoolService } from '@sharedServices/liquidity-pool.service';
import { TokenService } from '@sharedServices/token.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-swap-event',
  templateUrl: './swap-event.component.html',
  styleUrls: ['./swap-event.component.scss']
})
export class SwapEventComponent  extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: ISwapEventResponse;
  pool$: Observable<ILiquidityPoolSummaryResponse>;

  constructor(protected _liquidityPoolService: LiquidityPoolService, protected _tokenService: TokenService) {
    super(_liquidityPoolService, _tokenService);
  }

  ngOnChanges() {
    this.event = this.txEvent as ISwapEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
