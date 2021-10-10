import { ITransactionEvent } from "../transaction-event.interface";

export interface ISwapEvent extends ITransactionEvent {
  amountCrsIn: string;
  amountSrcIn: string;
  amountCrsOut: string;
  amountSrcOut: string;
  sender: string;
  to: string;
}
