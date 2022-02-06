import { Token } from '@sharedModels/ui/tokens/token';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Observable } from 'rxjs';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';
import { Injector } from '@angular/core';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

export abstract class TxEventBaseComponent {
  abstract txEvent: ITransactionEvent;

  protected readonly _liquidityPoolsService: LiquidityPoolsService;
  protected readonly _tokensService: TokensService;

  constructor(protected injector: Injector) {
    this._liquidityPoolsService = injector.get(LiquidityPoolsService);
    this._tokensService = injector.get(TokensService);
  }

  getLiquidityPool$(address: string): Observable<LiquidityPool> {
    return this._liquidityPoolsService.getLiquidityPool(address);
  }

  getToken$(address: string): Observable<Token> {
    return this._tokensService.getToken(address);
  }
}
