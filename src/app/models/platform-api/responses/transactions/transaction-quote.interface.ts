import { ITransactionEvent } from "./transaction-events/transaction-event.interface";

export interface ITransactionQuote {
  result: any;
  error: ITransactionError;
  gasUsed: number;
  events: ITransactionEvent[];
  request: string;
}

export interface ITransactionError {
  raw: string;
  friendly: string;
}
