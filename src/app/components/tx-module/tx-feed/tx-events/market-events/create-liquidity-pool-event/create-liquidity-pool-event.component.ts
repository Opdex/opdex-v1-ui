import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse, ICreateLiquidityPoolEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-create-liquidity-pool-event',
  templateUrl: './create-liquidity-pool-event.component.html',
  styleUrls: ['./create-liquidity-pool-event.component.scss']
})
export class CreateLiquidityPoolEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: ICreateLiquidityPoolEventResponse;
  pool$: Observable<ILiquidityPoolSummaryResponse>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as ICreateLiquidityPoolEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.liquidityPool);
  }
}
