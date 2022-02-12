import { ITokensResponse } from "@sharedModels/platform-api/responses/tokens/tokens-response.interface";
import { PagingResults } from "@sharedModels/ui/paging-results";
import { Token } from "@sharedModels/ui/tokens/token";

export class Tokens extends PagingResults<Token> {
  constructor(pools: ITokensResponse) {
    super(pools.results.map(pool => new Token(pool)), pools.paging);
  }
}
