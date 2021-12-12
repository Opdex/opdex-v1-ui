import { ITransactionEvent } from "../transaction-event.interface";

export interface IVaultProposalWithdrawVoteEvent extends ITransactionEvent {
  proposalId: number;
  voter: string;
  withdrawAmount: string;
  voterAmount: string;
  proposalYesAmount: string;
  proposalNoAmount: string;
  voteWithdrawn: boolean;
}
