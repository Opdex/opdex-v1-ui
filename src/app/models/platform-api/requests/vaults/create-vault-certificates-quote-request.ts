export interface ICreateVaultCertificateQuoteRequest {
        /// <summary>Address of the certificate holder.</summary>
        [Required]
        public Address Holder { get; set; }

        /// <summary>Amount of staking tokens to assign.</summary>
        [Required]
        public FixedDecimal Amount { get; set; }
}