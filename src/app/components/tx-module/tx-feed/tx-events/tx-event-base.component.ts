import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { Observable } from 'rxjs';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { Injector } from '@angular/core';

export abstract class TxEventBaseComponent {
  abstract txEvent: ITransactionEvent;

  protected readonly _liquidityPoolsService: LiquidityPoolsService;
  protected readonly _tokensService: TokensService;

  constructor(protected injector: Injector) {
    this._liquidityPoolsService = injector.get(LiquidityPoolsService);
    this._tokensService = injector.get(TokensService);
  }

  getLiquidityPool$(address: string): Observable<ILiquidityPoolSummary> {
    return this._liquidityPoolsService.getLiquidityPool(address, true);
  }

  getToken$(address: string): Observable<IToken> {
    return this._tokensService.getToken(address, true);
  }
}
