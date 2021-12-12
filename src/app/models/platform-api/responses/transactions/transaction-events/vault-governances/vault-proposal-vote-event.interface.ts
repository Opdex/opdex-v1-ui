import { ITransactionEvent } from "../transaction-event.interface";

export interface IVaultProposalVoteEvent extends ITransactionEvent {
  proposalId: number;
  voter: string;
  voteAmount: string;
  voterAmount: string;
  proposalYesAmount: string;
  proposalNoAmount: string;
  inFavor: boolean;
}
