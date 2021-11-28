import { ITransactionEvent } from "../transaction-event.interface";

export interface IDistributionEvent extends ITransactionEvent {
  vaultAmount: string;
  miningGovernanceAmount: string;
  periodIndex: number;
  totalSupply: string;
  nextDistributionBlock: number;
}
