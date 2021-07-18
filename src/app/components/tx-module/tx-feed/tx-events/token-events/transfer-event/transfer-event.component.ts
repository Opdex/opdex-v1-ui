import { Component, Input } from '@angular/core';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';
import { ITransactionEventResponse, ITransferEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-transfer-event',
  templateUrl: './transfer-event.component.html',
  styleUrls: ['./transfer-event.component.scss']
})
export class TransferEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEventResponse;
  event: ITransferEventResponse;
  token$: Observable<IToken>;

  constructor(protected _platformApi: PlatformApiService) {
    super(_platformApi);
  }

  ngOnChanges() {
    this.event = this.txEvent as ITransferEventResponse;
    this.token$ = this.getToken$(this.event.contract);
  }
}
