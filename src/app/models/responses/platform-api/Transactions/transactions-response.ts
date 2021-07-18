import { ICursorResponse } from '../cursor-response.interface';
import { ITransactionResponse } from './transaction-response';

export interface ITransactionsResponse {
  transactions: ITransactionResponse[],
  paging?: ICursorResponse
}
