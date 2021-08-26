import { ITransactionEvent } from "../transaction-event.interface";

export interface IProvideEvent extends ITransactionEvent {
  amountCrs: string;
  amountSrc: string;
  amountLpt: string;
  TotalSupply: string;
}
