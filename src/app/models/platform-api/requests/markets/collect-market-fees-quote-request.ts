export interface ICollectMarketFeesQuoteRequest {
    [Required]
        public Address Token { get; set; }

        [Required]
        public FixedDecimal Amount { get; set; }
}