import { ITransactionEvent } from './transaction-events/transaction-event.interface';
import { IBlock } from '../blocks/block.interface';
import { IPaging } from '../paging.interface';

export interface ITransactionReceipt {
  hash: string;
  from: string;
  to: string;
  newContractAddress?: string;
  gasUsed: number;
  block: IBlock;
  success: boolean;
  events: ITransactionEvent[];
}

export interface ITransactionReceipts extends IPaging<ITransactionReceipt> {}
