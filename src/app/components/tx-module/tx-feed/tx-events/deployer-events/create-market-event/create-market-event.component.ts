import { Component, Input, OnInit } from '@angular/core';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-create-market-event',
  templateUrl: './create-market-event.component.html',
  styleUrls: ['./create-market-event.component.scss']
})
export class CreateMarketEventComponent implements OnInit {

  constructor() { }

  @Input() txEvent: ITransactionEvent;

  ngOnInit(): void {
  }

}
