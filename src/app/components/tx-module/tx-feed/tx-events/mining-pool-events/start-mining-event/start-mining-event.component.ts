import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse, IStartMiningEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-start-mining-event',
  templateUrl: './start-mining-event.component.html',
  styleUrls: ['./start-mining-event.component.scss']
})
export class StartMiningEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: IStartMiningEventResponse;
  pool$: Observable<ILiquidityPoolSummaryResponse>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IStartMiningEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
