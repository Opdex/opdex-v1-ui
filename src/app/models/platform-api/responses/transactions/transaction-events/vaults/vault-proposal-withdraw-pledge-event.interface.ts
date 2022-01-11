import { IVaultProposalBaseEvent } from "./vault-proposal-base-event.interface";

export interface IVaultProposalWithdrawPledgeEvent extends IVaultProposalBaseEvent {
  voter: string;
  withdrawAmount: string;
  pledgerAmount: string;
  proposalPledgeAmount: string;
  pledgeWithdrawn: boolean;
}
