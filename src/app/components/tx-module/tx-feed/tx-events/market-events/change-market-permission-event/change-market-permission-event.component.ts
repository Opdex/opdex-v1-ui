import { Component, Input, OnInit } from '@angular/core';
import { IChangeMarketPermissionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/markets/change-market-permission-event.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';

@Component({
  selector: 'opdex-change-market-permission-event',
  templateUrl: './change-market-permission-event.component.html',
  styleUrls: ['./change-market-permission-event.component.scss']
})
export class ChangeMarketPermissionEventComponent implements OnInit {
  @Input() txEvent: ITransactionEvent;
  event: IChangeMarketPermissionEvent

  ngOnInit(): void {
    this.event = this.txEvent as IChangeMarketPermissionEvent;
  }
}
