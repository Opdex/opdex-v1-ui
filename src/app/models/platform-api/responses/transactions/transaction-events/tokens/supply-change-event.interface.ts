import { ITransactionEvent } from "../transaction-event.interface";

export interface ISupplyChangeEvent extends ITransactionEvent {
  totalSupply: string;
}
