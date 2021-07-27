import { Component, Input } from '@angular/core';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';
import { ITransactionEventResponse, IDistributionEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { LiquidityPoolService } from '@sharedServices/liquidity-pool.service';
import { TokenService } from '@sharedServices/token.service';
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

  constructor(protected _liquidityPoolService: LiquidityPoolService, protected _tokenService: TokenService) {
    super(_liquidityPoolService, _tokenService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IDistributionEventResponse;
    this.token$ = this.getToken$(this.event.contract);
  }
}
