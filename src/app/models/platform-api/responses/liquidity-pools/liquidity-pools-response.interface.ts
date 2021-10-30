import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { IPaging } from '../paging.interface';

export interface ILiquidityPoolsResponse extends IPaging<ILiquidityPoolSummary> {}
