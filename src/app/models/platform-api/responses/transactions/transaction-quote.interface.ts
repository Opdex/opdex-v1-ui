import { ITransactionQuoteRequest } from '@sharedModels/platform-api/requests/transactions/transaction-quote-request';
import { ITransactionEvent } from "./transaction-events/transaction-event.interface";

export interface ITransactionQuote {
  result: any;
  error: ITransactionError;
  gasUsed: number;
  events: ITransactionEvent[];
  request: ITransactionQuoteRequest;
}

export interface ITransactionError {
  raw: string;
  friendly: string;
}
