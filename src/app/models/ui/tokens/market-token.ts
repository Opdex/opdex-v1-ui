import { IMarketToken } from "@sharedModels/platform-api/responses/tokens/token.interface";
import { Token } from "@sharedModels/ui/tokens/token";

export class MarketToken extends Token {
  private _market: string;
  private _liquidityPool: string;

  public get market(): string {
    return this._market;
  }

  public get liquidityPool(): string {
    return this._liquidityPool;
  }

  constructor(token: IMarketToken) {
    super(token);

    this._market = token.market;
    this._liquidityPool = token.liquidityPool;
  }
}
