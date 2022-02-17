export interface ICreateStandardMarketQuoteRequest {
  owner: string;
  transactionFeePercent: string;
  authPoolCreators: boolean;
  authLiquidityProviders: boolean;
  authTraders: boolean;
  enableMarketFee: boolean;
}

export class CreateStandardMarketQuoteRequest {
  private _owner: string;
  private _transactionFeePercent: string;
  private _authPoolCreators: boolean;
  private _authLiquidityProviders: boolean;
  private _authTraders: boolean;
  private _enableMarketFee: boolean;

  public get payload(): ICreateStandardMarketQuoteRequest {
    return {
      owner: this._owner,
      transactionFeePercent: this._transactionFeePercent,
      authPoolCreators: this._authPoolCreators,
      authLiquidityProviders: this._authLiquidityProviders,
      authTraders: this._authTraders,
      enableMarketFee: this._enableMarketFee
    }
  }

  constructor(owner: string, transactionFeePercent: string, authPoolCreators: boolean,
              authLiquidityProviders: boolean, authTraders: boolean, enableMarketFee: boolean) {
    this._owner = owner;
    this._transactionFeePercent = transactionFeePercent;
    this._authPoolCreators = authPoolCreators;
    this._authLiquidityProviders= authLiquidityProviders;
    this._authTraders = authTraders;
    this._enableMarketFee = enableMarketFee;
  }
}
