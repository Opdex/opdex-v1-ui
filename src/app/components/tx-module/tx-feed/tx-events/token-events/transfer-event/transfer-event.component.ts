import { Component, Input } from '@angular/core';
import { IToken } from '@sharedModels/responses/platform-api/tokens/token.interface';
import { ITransferEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/tokens/transfer-event.interface';
import { ITransactionEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/transaction-event.interface';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { Observable } from 'rxjs';
import { TxEventBaseComponent } from '../../tx-event-base.component';

@Component({
  selector: 'opdex-transfer-event',
  templateUrl: './transfer-event.component.html',
  styleUrls: ['./transfer-event.component.scss']
})
export class TransferEventComponent extends TxEventBaseComponent {
  @Input() txEvent: ITransactionEvent;
  event: ITransferEvent;
  token$: Observable<IToken>;

  constructor(protected _liquidityPoolsService: LiquidityPoolsService, protected _tokensService: TokensService) {
    super(_liquidityPoolsService, _tokensService);
  }

  ngOnChanges() {
    this.event = this.txEvent as ITransferEvent;
    this.token$ = this.getToken$(this.event.contract);
  }
}
