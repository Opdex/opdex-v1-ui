import { ITransactionEvent } from "../transaction-event.interface";

export interface ICreateVaultProposalEvent extends ITransactionEvent {
  proposalId: number;
  wallet: string;
  amount: string;
  type: string;
  status: string;
  expiration: number;
  description: string;
}
