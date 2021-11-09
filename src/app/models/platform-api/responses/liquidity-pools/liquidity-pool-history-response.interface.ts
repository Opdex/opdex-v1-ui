import { IPaging } from '../paging.interface';
import { ILiquidityPoolSnapshot } from './liquidity-pool.interface';

export interface ILiquidityPoolHistoryResponse extends IPaging<ILiquidityPoolSnapshot> {}
