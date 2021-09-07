import { Component, Input, OnInit } from '@angular/core';
import { ICreateMarketEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/deployers/create-market-event.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-create-market-event',
  templateUrl: './create-market-event.component.html',
  styleUrls: ['./create-market-event.component.scss']
})
export class CreateMarketEventComponent implements OnInit {

  @Input() txEvent: ITransactionEvent;
  event: ICreateMarketEvent;

  isPublic = false;

  ngOnInit(): void {
    this.event = this.txEvent as ICreateMarketEvent;
    this.isPublic = this.event.authPoolCreators || this.event.authProviders || this.event.authTraders;
  }
}
