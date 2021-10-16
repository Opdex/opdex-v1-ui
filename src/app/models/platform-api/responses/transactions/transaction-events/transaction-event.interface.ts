import { TransactionEventTypes } from 'src/app/enums/transaction-events';

export interface ITransactionEvent {
  sortOrder: number;
  eventType: TransactionEventTypes;
  contract: string;
}
