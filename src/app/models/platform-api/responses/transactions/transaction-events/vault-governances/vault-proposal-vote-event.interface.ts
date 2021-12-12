import { ITransactionEvent } from "../transaction-event.interface";

export interface IVaultProposalVoteEvent extends ITransactionEvent {
  proposalId: string;
  voter: string;
  voteAmount: string;
  voterAmount: string;
  proposalYesAmount: string;
  proposalNoAmount: string;
  inFavor: boolean;
}
