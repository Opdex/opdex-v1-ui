export interface IAddTokenRequest {
  tokenAddress: string;
}

export class AddTokenRequest {
  private _tokenAddress: string;

  public get payload(): IAddTokenRequest {
    return {
      tokenAddress: this._tokenAddress
    }
  }

  constructor(tokenAddress: string) {
    this._tokenAddress = tokenAddress;
  }
}
