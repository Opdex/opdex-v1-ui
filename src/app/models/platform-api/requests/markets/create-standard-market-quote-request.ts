export interface ICreateStandardMarketQuoteRequest {
    //[Required]
    marketOwner: Address;
    //[Required]
    transactionFee: number;
    //[Required]
    authPoolCreators: boolean;
    //[Required]
    authLiquidityProviders: boolean;
    //[Required]
    authTraders: boolean;
    //[Required]
    enableMarketFee: boolean;
}