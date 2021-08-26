import { ITransactionEvent } from "../transaction-event.interface";

export interface IApprovalEvent extends ITransactionEvent {
  owner: string;
  spender: string;
  amount: string;
}
