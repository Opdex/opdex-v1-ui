export interface ICreateLiquidityPoolRequest {
  token: string;
  market: string;
}

export class CreateLiquidityPoolRequest {
  private _token: string;
  private _market: string;

  public get payload(): ICreateLiquidityPoolRequest {
    return {
      token: this._token,
      market: this._market
    }
  }

  constructor(token: string, market: string) {
    this._token = token;
    this._market = market;
  }
}
