import { IMarketTokensResponse } from "@sharedModels/platform-api/responses/tokens/market-tokens-response.interface";
import { PagingResults } from "@sharedModels/ui/paging-results";
import { Token } from "@sharedModels/ui/tokens/token";

export class MarketTokens extends PagingResults<Token> {
  constructor(pools: IMarketTokensResponse) {
    super(pools.results.map(pool => new Token(pool)), pools.paging);
  }
}
