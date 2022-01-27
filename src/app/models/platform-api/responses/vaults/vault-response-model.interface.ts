export interface IVaultResponseModel {
  vault: string;
  token: string;
  tokensLocked: string;
  tokensUnassigned: string;
  tokensProposed: string;
  totalPledgeMinimum: string;
  totalVoteMinimum: string;
  vestingDuration: number;
  createdBlock: number;
  modifiedBlock: number;
}
