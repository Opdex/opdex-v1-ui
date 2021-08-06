import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse, IStopStakingEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-stop-staking-event',
  templateUrl: './stop-staking-event.component.html',
  styleUrls: ['./stop-staking-event.component.scss']
})
export class StopStakingEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: IStopStakingEventResponse;
  pool$: Observable<ILiquidityPoolSummaryResponse>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IStopStakingEventResponse;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
