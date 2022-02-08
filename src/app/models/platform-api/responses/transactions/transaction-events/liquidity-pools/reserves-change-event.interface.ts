import { ITransactionEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/transaction-event.interface';

export interface IRemoveLiquidityEvent extends ITransactionEvent {
  crs: string;
  src: string;
}
