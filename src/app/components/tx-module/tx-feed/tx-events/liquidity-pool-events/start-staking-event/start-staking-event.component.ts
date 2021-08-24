import { Component, Input } from '@angular/core';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { IStartStakingEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/liquidity-pools/staking/start-staking-event.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-start-staking-event',
  templateUrl: './start-staking-event.component.html',
  styleUrls: ['./start-staking-event.component.scss']
})
export class StartStakingEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IStartStakingEvent;
  pool$: Observable<ILiquidityPoolSummary>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IStartStakingEvent;
    this.pool$ = this.getLiquidityPool$(this.event.contract);
  }
}
