import { Component, Input } from '@angular/core';
import { IToken } from '@sharedModels/responses/platform-api/tokens/token.interface';
import { IDistributionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/tokens/distribution-event.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
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
  token$: Observable<IToken>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as IDistributionEvent;
    this.token$ = this.getToken$(this.event.contract);
  }
}
