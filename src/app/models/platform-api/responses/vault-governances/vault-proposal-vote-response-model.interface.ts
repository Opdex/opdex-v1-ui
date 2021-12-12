export interface IVaultProposalVoteResponseModel {
  vault: string;
  proposalId: number;
  voter: string;
  vote: string;
  balance: string;
  inFavor: boolean;
}
