import { ITransactionEventResponse } from "./transaction-response";

export interface ITransactionQuoteResponse {
  result: any;
  error: string;
  gasUsed: number;
  events: ITransactionEventResponse[];
  request: string;
}
