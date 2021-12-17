import { IVaultProposalBaseEvent } from "./vault-proposal-base-event.interface";

export interface IVaultProposalVoteEvent extends IVaultProposalBaseEvent {
  voter: string;
  voteAmount: string;
  voterAmount: string;
  proposalYesAmount: string;
  proposalNoAmount: string;
  inFavor: boolean;
}
