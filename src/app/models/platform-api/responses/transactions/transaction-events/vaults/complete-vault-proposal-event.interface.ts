import { IVaultProposalBaseEvent } from "./vault-proposal-base-event.interface";

export interface ICompleteVaultProposalEvent extends IVaultProposalBaseEvent {
  approved: boolean;
}
