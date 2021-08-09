import { Component, Input } from '@angular/core';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';
import { ITransactionEventResponse, IDistributionEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-distribution-event',
  templateUrl: './distribution-event.component.html',
  styleUrls: ['./distribution-event.component.scss']
})
export class DistributionEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: IDistributionEventResponse;
  token$: Observable<IToken>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IDistributionEventResponse;
    this.token$ = this.getToken$(this.event.contract);
  }
}
