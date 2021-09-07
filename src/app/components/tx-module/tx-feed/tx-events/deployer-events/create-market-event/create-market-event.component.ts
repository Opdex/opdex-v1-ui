import { Component, Input, OnInit } from '@angular/core';
import { ICreateMarketEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/deployers/create-market-event.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-create-market-event',
  templateUrl: './create-market-event.component.html',
  styleUrls: ['./create-market-event.component.scss']
})
export class CreateMarketEventComponent {

  @Input() txEvent: ICreateMarketEvent;

  isPublic = false;

  ngOnInit(): void {
    this.isPublic = this.txEvent.authPoolCreators || this.txEvent.authProviders || this.txEvent.authTraders;
  }
}
