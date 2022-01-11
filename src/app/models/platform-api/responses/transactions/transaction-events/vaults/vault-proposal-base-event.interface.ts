import { ITransactionEvent } from "../transaction-event.interface";

export interface IVaultProposalBaseEvent extends ITransactionEvent {
  proposalId: number;
}
