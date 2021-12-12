export interface IVaultProposalResponseModel {
  vault: string;
  tokeN: string;
  proposalId: number;
  creator: string;
  wallet: string;
  amount: string;
  description: string;
  type: string;
  status: string;
  expiration: number;
  yesAmount: string;
  noAmount: string;
  pledgeAmount: string;
  approved: boolean;
}
