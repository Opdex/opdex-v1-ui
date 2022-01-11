import { IVaultProposalBaseEvent } from "./vault-proposal-base-event.interface";

export interface IVaultProposalPledgeEvent extends IVaultProposalBaseEvent {
  pledger: string;
  pledgeAmount: string;
  pledgerAmount: string;
  proposalPledgeAmount: string;
  totalPledgeMinimumMet: boolean;
}
