import { IVaultCertificate } from './vault-certificate.interface';
export interface IVaultProposalResponseModel {
  vault: string;
  token: string;
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
  certificate?: IVaultCertificate;
  createdBlock: number;
  modifiedBlock: number;
}
