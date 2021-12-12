import { ITransactionEvent } from "../transaction-event.interface";

export interface ICompleteVaultProposalEvent extends ITransactionEvent {
  proposalId: string;
  approved: boolean;
}
