import { ITransactionEvent } from "../transaction-event.interface";

export interface ICreateVaultProposalEvent extends ITransactionEvent {
  proposalId: string;
  wallet: string;
  amount: string;
  type: string;
  status: string;
  expiration: number;
  description: string;
}
