import { IToken } from '@sharedModels/responses/platform-api/token.interface';
import { Component, Input } from '@angular/core';
import { ITransactionEventResponse, IApprovalEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';
import { TokenService } from '@sharedServices/token.service';
import { LiquidityPoolService } from '@sharedServices/liquidity-pool.service';

@Component({
  selector: 'opdex-approval-event',
  templateUrl: './approval-event.component.html',
  styleUrls: ['./approval-event.component.scss']
})
export class ApprovalEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: IApprovalEventResponse;
  token$: Observable<IToken>;

  constructor(protected _liquidityPoolService: LiquidityPoolService, protected _tokenService: TokenService) {
    super(_liquidityPoolService, _tokenService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IApprovalEventResponse;
    this.token$ = this.getToken$(this.event.contract);
  }
}
