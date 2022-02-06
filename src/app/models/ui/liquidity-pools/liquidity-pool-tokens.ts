import { Token } from '@sharedModels/ui/tokens/token';
import { ITokenGroup } from '@sharedModels/platform-api/responses/tokens/token.interface';

export class LiquidityPoolTokens {
  private _crs: Token;
  private _src: Token;
  private _lp: Token;

  public get crs(): Token {
    return this._crs;
  }

  public get src(): Token {
    return this._src;
  }

  public get lp(): Token {
    return this._lp;
  }

  constructor(tokens: ITokenGroup) {
    this._crs = new Token(tokens.crs);
    this._src = new Token(tokens.src);
    this._lp = new Token(tokens.lp);
  }
}
