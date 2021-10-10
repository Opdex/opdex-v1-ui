import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { Component, Injector, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { IApprovalEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/tokens/approve-event.interface';

@Component({
  selector: 'opdex-approval-event',
  templateUrl: './approval-event.component.html',
  styleUrls: ['./approval-event.component.scss']
})
export class ApprovalEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IApprovalEvent;
  token$: Observable<IToken>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IApprovalEvent;
    this.token$ = this.getToken$(this.event.contract);
  }
}
