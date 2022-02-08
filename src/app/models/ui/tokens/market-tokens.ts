import { MarketToken } from '@sharedModels/ui/tokens/market-token';
import { IMarketTokensResponse } from "@sharedModels/platform-api/responses/tokens/market-tokens-response.interface";
import { PagingResults } from "@sharedModels/ui/paging-results";

export class MarketTokens extends PagingResults<MarketToken> {
  constructor(pools: IMarketTokensResponse) {
    super(pools.results.map(pool => new MarketToken(pool)), pools.paging);
  }
}
