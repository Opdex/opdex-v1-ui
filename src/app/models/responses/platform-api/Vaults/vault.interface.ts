export interface IVault {
  address: string;
}

export interface IVaultCertificate {
  owner: string; // address
  amount: string; // decimal number
  vestingStartBlock: number; // block number (number type is safe)
  vestingEndBlock: number; // block number (number type is safe)
  redeemed: boolean;
  revoked: boolean;
}


export interface IVaultCertificatesResponse {
  results: IVaultCertificate[];
  paging: any;
}
