import { Component, Input } from '@angular/core';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';
import { ITransactionEventResponse, ITransferEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { LiquidityPoolService } from '@sharedServices/liquidity-pool.service';
import { TokenService } from '@sharedServices/token.service';
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

  constructor(protected _liquidityPoolService: LiquidityPoolService, protected _tokenService: TokenService) {
    super(_liquidityPoolService, _tokenService);
  }

  ngOnChanges() {
    this.event = this.txEvent as ITransferEventResponse;
    this.token$ = this.getToken$(this.event.contract);
  }
}
