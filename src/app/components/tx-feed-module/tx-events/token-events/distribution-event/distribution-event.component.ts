import { Token } from '@sharedModels/ui/tokens/token';
import { Component, Injector, Input } from '@angular/core';
import { IDistributionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/tokens/distribution-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-distribution-event',
  templateUrl: './distribution-event.component.html',
  styleUrls: ['./distribution-event.component.scss']
})
export class DistributionEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: IDistributionEvent;
  token$: Observable<Token>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as IDistributionEvent;
    this.token$ = this.getToken$(this.event.contract);
  }
}
