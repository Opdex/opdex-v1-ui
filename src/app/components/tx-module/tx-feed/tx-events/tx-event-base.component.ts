import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { Observable } from 'rxjs';
import { TokensService } from '@sharedServices/platform/tokens.service';

export abstract class TxEventBaseComponent {
  abstract txEvent: ITransactionEventResponse;

  constructor(
    protected _liquidityPoolsService: LiquidityPoolsService,
    protected _tokensService: TokensService
  ) { }

  getLiquidityPool$(address: string): Observable<ILiquidityPoolSummaryResponse> {
    return this._liquidityPoolsService.getLiquidityPool(address);
  }

  getToken$(address: string): Observable<IToken> {
    return this._tokensService.getToken(address);
  }
}
