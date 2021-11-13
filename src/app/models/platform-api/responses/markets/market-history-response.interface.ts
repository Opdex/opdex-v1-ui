import { IPaging } from '../paging.interface';
import { IMarketSnapshot } from './market-snapshot.interface';

export interface IMarketHistoryResponse extends IPaging<IMarketSnapshot> {}
