import { ITransactionEvent } from "../transaction-event.interface";

export interface IMineEvent extends ITransactionEvent {
  miner: string;
  amount: string;
  minerBalance: string;
  totalSupply: string;
}
