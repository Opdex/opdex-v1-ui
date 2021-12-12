import { ITransactionEvent } from "../transaction-event.interface";

export interface IVaultProposalWithdrawPledgeEvent extends ITransactionEvent {
  proposalId: string;
  voter: string;
  withdrawAmount: string;
  pledgerAmount: string;
  proposalPledgeAmount: string;
  pledgeWithdrawn: boolean;
}
