import { IVaultProposalBaseEvent } from "./vault-proposal-base-event.interface";

export interface IVaultProposalWithdrawVoteEvent extends IVaultProposalBaseEvent {
  voter: string;
  withdrawAmount: string;
  voterAmount: string;
  proposalYesAmount: string;
  proposalNoAmount: string;
  voteWithdrawn: boolean;
}
