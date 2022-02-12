import { Component, Injector, Input } from '@angular/core';
import { ICreateLiquidityPoolEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/markets/create-liquidity-pool-event.interface';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { Token } from '@sharedModels/ui/tokens/token';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-create-liquidity-pool-event',
  templateUrl: './create-liquidity-pool-event.component.html',
  styleUrls: ['./create-liquidity-pool-event.component.scss']
})
export class CreateLiquidityPoolEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: ICreateLiquidityPoolEvent;
  token$: Observable<Token>;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnChanges() {
    this.event = this.txEvent as ICreateLiquidityPoolEvent;
    this.token$ = this.getToken$(this.event.token);
  }
}
