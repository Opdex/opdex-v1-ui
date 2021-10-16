export interface ICreateStandardMarketQuoteRequest {
  marketOwner: string;
  transactionFee: number;
  authPoolCreators: boolean;
  authLiquidityProviders: boolean;
  authTraders: boolean;
  enableMarketFee: boolean;
  isValid?: boolean;
}

export class CreateStandardMarketQuoteRequest implements ICreateStandardMarketQuoteRequest {
  marketOwner: string;
  transactionFee: number;
  authPoolCreators: boolean;
  authLiquidityProviders: boolean;
  authTraders: boolean;
  enableMarketFee: boolean;
  isValid?: boolean = true;

  constructor(request: ICreateStandardMarketQuoteRequest) {
    if(!request.marketOwner)
      this.isValid = false;

    this.marketOwner = request.marketOwner;
    this.transactionFee = request.transactionFee;
    this.authPoolCreators = request.authPoolCreators;
    this.authLiquidityProviders= request.authLiquidityProviders;
    this.authTraders = request.authTraders;
    this.enableMarketFee = request.enableMarketFee;
  }
}
