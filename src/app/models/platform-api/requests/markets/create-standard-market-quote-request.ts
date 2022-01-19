export interface ICreateStandardMarketQuoteRequest {
  owner: string;
  transactionFee: number;
  authPoolCreators: boolean;
  authLiquidityProviders: boolean;
  authTraders: boolean;
  enableMarketFee: boolean;
}

export class CreateStandardMarketQuoteRequest {
  private _owner: string;
  private _transactionFee: number;
  private _authPoolCreators: boolean;
  private _authLiquidityProviders: boolean;
  private _authTraders: boolean;
  private _enableMarketFee: boolean;

  public get payload(): ICreateStandardMarketQuoteRequest {
    return {
      owner: this._owner,
      transactionFee: this._transactionFee,
      authPoolCreators: this._authPoolCreators,
      authLiquidityProviders: this._authLiquidityProviders,
      authTraders: this._authTraders,
      enableMarketFee: this._enableMarketFee
    }
  }

  constructor(owner: string, transactionFee: number, authPoolCreators: boolean,
              authLiquidityProviders: boolean, authTraders: boolean, enableMarketFee: boolean) {
    this._owner = owner;
    this._transactionFee = transactionFee;
    this._authPoolCreators = authPoolCreators;
    this._authLiquidityProviders= authLiquidityProviders;
    this._authTraders = authTraders;
    this._enableMarketFee = enableMarketFee;
  }
}
