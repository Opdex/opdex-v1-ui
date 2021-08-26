import { ITransactionEvent } from "../transaction-event.interface";

export interface ITransferEvent extends ITransactionEvent {
  from: string;
  to: string;
  amount: string;
}
