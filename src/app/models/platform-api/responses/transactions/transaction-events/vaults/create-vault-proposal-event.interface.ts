import { IVaultProposalBaseEvent } from "./vault-proposal-base-event.interface";

export interface ICreateVaultProposalEvent extends IVaultProposalBaseEvent {
  wallet: string;
  amount: string;
  type: string;
  status: string;
  expiration: number;
  description: string;
}
