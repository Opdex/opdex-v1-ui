export interface ISetMarketPermissionsQuoteRequest {
    public MarketPermissionType Permission { get; set; }

    [Required]
    public bool Authorize { get; set; }
}