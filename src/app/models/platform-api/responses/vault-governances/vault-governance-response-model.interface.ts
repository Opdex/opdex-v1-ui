export interface IVaultGovernanceResponseModel {
  vault: string;
  token: string;
  tokensUnassigned: string;
  tokensProposed: string;
  totalPledgeMinimum: string;
  totalVoteMinimum: string;
  vestingDuration: string;
}
