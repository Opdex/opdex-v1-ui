import { IToken } from './../../../../../../models/responses/platform-api/token.interface';
import { Component, Input } from '@angular/core';
import { ITransactionEventResponse, IApprovalEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-approval-event',
  templateUrl: './approval-event.component.html',
  styleUrls: ['./approval-event.component.scss']
})
export class ApprovalEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: IApprovalEventResponse;
  token$: Observable<IToken>;

  constructor(protected _platformApi: PlatformApiService) {
    super(_platformApi);
  }

  ngOnChanges() {
    this.event = this.txEvent as IApprovalEventResponse;
    this.token$ = this.getToken$(this.event.contract);
  }
}
