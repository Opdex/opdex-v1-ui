export interface IAddLiquidityQuoteRequest {
    public FixedDecimal AmountIn { get; set; }

    /// <summary>
    /// The smart contract address of the deposited token or "CRS" for Cirrus token.
    /// </summary>
    public Address TokenIn { get; set; }

    /// <summary>
    /// The address of the liquidity pool to get a quote for.
    /// </summary>
    public Address Pool { get; set; }
}