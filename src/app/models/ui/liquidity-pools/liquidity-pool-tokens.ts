import { MarketToken } from '@sharedModels/ui/tokens/market-token';
import { Token } from '@sharedModels/ui/tokens/token';
import { ITokenGroup } from '@sharedModels/platform-api/responses/tokens/token.interface';

export class LiquidityPoolTokens {
  private _crs: Token;
  private _src: MarketToken;
  private _lp: MarketToken;

  public get crs(): Token {
    return this._crs;
  }

  public get src(): MarketToken {
    return this._src;
  }

  public get lp(): MarketToken {
    return this._lp;
  }

  constructor(tokens: ITokenGroup) {
    this._crs = new Token(tokens.crs);
    this._src = new MarketToken(tokens.src);
    this._lp = new MarketToken(tokens.lp);
  }
}
