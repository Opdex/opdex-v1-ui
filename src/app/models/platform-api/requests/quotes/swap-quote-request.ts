export interface ISwapQuoteRequest {

        /// <summary>
        /// The address of the token being deposited. Null if CRS
        /// </summary>
        public Address TokenIn { get; set; }

        /// <summary>
        /// The address of the token being retrieved. Null if CRS
        /// </summary>
        public Address TokenOut { get; set; }

        /// <summary>
        /// The amount of tokens to swap
        /// </summary>
        public FixedDecimal TokenInAmount { get; set; }

        /// <summary>
        /// The amount of tokens to receive
        /// </summary>
        public FixedDecimal TokenOutAmount { get; set; }
}