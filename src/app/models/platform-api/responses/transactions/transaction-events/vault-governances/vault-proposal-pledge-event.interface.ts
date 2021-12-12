import { ITransactionEvent } from "../transaction-event.interface";

export interface IVaultProposalPledgeEvent extends ITransactionEvent {
  proposalId: string;
  pledger: string;
  pledgeAmount: string;
  pledgerAmount: string;
  proposalPledgeAmount: string;
  totalPledgeMinimumMet: boolean;
}
