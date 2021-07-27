import { LiquidityPoolService } from '@sharedServices/liquidity-pool.service';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { Observable } from 'rxjs';
import { TokenService } from '@sharedServices/token.service';

export abstract class TxEventBaseComponent {
  abstract txEvent: ITransactionEventResponse;

  constructor(
    protected _liquidityPoolService: LiquidityPoolService,
    protected _tokenService: TokenService
  ) { }

  getLiquidityPool$(address: string): Observable<ILiquidityPoolSummaryResponse> {
    return this._liquidityPoolService.getLiquidityPool(address);
  }

  getToken$(address: string): Observable<IToken> {
    return this._tokenService.getToken(address);
  }
}
