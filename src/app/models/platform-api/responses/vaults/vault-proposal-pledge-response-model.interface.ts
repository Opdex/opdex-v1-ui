export interface IVaultProposalPledgeResponseModel {
  vault: string;
  proposalId: number;
  pledger: string;
  pledge: string;
  balance: string;
  createdBlock: number;
  modifiedBlock: number;
}
