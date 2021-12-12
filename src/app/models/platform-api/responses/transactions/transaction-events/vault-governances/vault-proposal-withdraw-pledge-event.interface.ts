import { ITransactionEvent } from "../transaction-event.interface";

export interface IVaultProposalWithdrawPledgeEvent extends ITransactionEvent {
  proposalId: number;
  voter: string;
  withdrawAmount: string;
  pledgerAmount: string;
  proposalPledgeAmount: string;
  pledgeWithdrawn: boolean;
}
