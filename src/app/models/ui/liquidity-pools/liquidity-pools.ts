import { PagingResults } from '@sharedModels/ui/paging-results';
import { ILiquidityPoolsResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';

export class LiquidityPools extends PagingResults<LiquidityPool> {
  constructor(pools: ILiquidityPoolsResponse) {
    super(pools.results.map(pool => new LiquidityPool(pool)), pools.paging);
  }
}
