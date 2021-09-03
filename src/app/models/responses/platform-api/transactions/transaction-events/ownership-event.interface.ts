import { ITransactionEvent } from "./transaction-event.interface";

export interface IOwnershipEvent extends ITransactionEvent {
  from: string;
  to: string;
}
