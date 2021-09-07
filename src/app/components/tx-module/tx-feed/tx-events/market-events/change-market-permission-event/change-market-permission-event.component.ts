import { Component, Input } from '@angular/core';
import { IChangeMarketPermissionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/markets/change-market-permission-event.interface';

@Component({
  selector: 'opdex-change-market-permission-event',
  templateUrl: './change-market-permission-event.component.html',
  styleUrls: ['./change-market-permission-event.component.scss']
})
export class ChangeMarketPermissionEventComponent {
  @Input() txEvent: IChangeMarketPermissionEvent;
}
