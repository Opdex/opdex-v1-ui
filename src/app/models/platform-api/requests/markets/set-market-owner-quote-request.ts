export interface ISetMarketOwnerQuoteRequest {
  owner: string;
}

export class SetMarketOwnerQuoteRequest {
  private _owner: string;

  public get payload(): ISetMarketOwnerQuoteRequest {
    return {
      owner: this._owner
    }
  }

  constructor(owner: string) {
    this._owner = owner;
  }
}
