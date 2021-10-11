export interface ICreateStandardMarketQuoteRequest {
    [Required]
    public Address MarketOwner { get; set; }

    [Required]
    public uint TransactionFee { get; set; }

    [Required]
    public bool AuthPoolCreators { get; set; }

    [Required]
    public bool AuthLiquidityProviders { get; set; }

    [Required]
    public bool AuthTraders { get; set; }

    [Required]
    public bool EnableMarketFee { get; set; }
}