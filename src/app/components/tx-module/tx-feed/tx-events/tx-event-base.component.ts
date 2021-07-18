import { IToken } from '@sharedModels/responses/platform-api/token.interface';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/responses/platform-api/Pools/liquidity-pool.interface';
import { ITransactionEventResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';

export abstract class TxEventBaseComponent {
  abstract txEvent: ITransactionEventResponse;

  constructor(
    protected _platformApi: PlatformApiService
  ) { }

  getLiquidityPool$(address: string): Observable<ILiquidityPoolSummaryResponse> {
    return this._platformApi.getPool(address);
  }

  getToken$(address: string): Observable<IToken> {
    return this._platformApi.getToken(address);
  }
}
