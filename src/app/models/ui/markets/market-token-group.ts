import { IMarketTokenGroupResponse } from '@sharedModels/platform-api/responses/markets/market.interface';
import { Token } from '@sharedModels/ui/tokens/token';

export class MarketTokenGroup {
  private _crs: Token;
  private _staking: Token

  public get crs(): Token {
    return this._crs;
  }

  public get staking(): Token {
    return this._staking;
  }

  constructor(tokens: IMarketTokenGroupResponse) {
    this._crs = new Token(tokens.crs);
    this._staking = !!tokens.staking ? new Token(tokens.staking) : null;
  }
}
