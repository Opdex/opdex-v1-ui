import { ITransactionEvent } from "./transaction-events/transaction-event.interface";

export interface ITransactionQuote {
  result: any;
  error: string;
  gasUsed: number;
  events: ITransactionEvent[];
  request: string;
}
