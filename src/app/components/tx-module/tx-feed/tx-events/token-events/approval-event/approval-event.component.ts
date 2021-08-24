import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IToken } from '@sharedModels/responses/platform-api/tokens/token.interface';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { IApprovalEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/tokens/approve-event.interface';

@Component({
  selector: 'opdex-approval-event',
  templateUrl: './approval-event.component.html',
  styleUrls: ['./approval-event.component.scss']
})
export class ApprovalEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IApprovalEvent;
  token$: Observable<IToken>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IApprovalEvent;
    this.token$ = this.getToken$(this.event.contract);
  }
}
