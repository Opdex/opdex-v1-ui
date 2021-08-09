import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse, IRemoveLiquidityEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-remove-liquidity-event',
  templateUrl: './remove-liquidity-event.component.html',
  styleUrls: ['./remove-liquidity-event.component.scss']
})
export class RemoveLiquidityEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: IRemoveLiquidityEventResponse;
  pool$: Observable<ILiquidityPoolSummaryResponse>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IRemoveLiquidityEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
