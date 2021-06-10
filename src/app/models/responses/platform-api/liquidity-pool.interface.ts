import { IMiningPool } from './mining-pool.interface';
import { IToken } from './token.interface';

export interface ILiquidityPool {
  address: string;
  srcToken: IToken;
  miningPool: IMiningPool;
}
