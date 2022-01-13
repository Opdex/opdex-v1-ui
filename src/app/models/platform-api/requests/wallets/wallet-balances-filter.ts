import { TokenAttributes } from "../tokens/tokens-filter";

export interface IWalletBalancesRequest {
  tokens?: string[];
  tokenAttributes?: TokenAttributes[];
  cursor?: string
  includeZeroBalances?: boolean;
  limit?: number;
  direction?: string;
}

export class WalletBalancesFilter {
  tokens?: string[];
  tokenAttributes?: TokenAttributes[];
  cursor?: string
  includeZeroBalances: boolean;
  limit: number;
  direction: string;

  constructor(request: IWalletBalancesRequest) {
    if (!!request === false) {
      this.limit = 5;
      this.direction = 'DESC';
      this.includeZeroBalances = false;
      return;
    };

    this.tokens = request.tokens;
    this.tokenAttributes = request.tokenAttributes;
    this.includeZeroBalances = request.includeZeroBalances || false;
    this.cursor = request.cursor;
    this.limit = request.limit || 5;
    this.direction = request.direction || 'DESC';
  }

  buildQueryString(): string {
    if (this.cursor?.length) return `?cursor=${this.cursor}`;

    let query = '';

    if (this.tokens?.length > 0) {
      this.tokens.forEach(contract => query = this.addToQuery(query, 'tokens', contract));
    }

    if (this.tokenAttributes?.length > 0) {
      this.tokenAttributes.forEach(attribute => query = this.addToQuery(query, 'tokenAttributes', attribute));
    }

    query = this.addToQuery(query, 'includeZeroBalances', this.includeZeroBalances.toString());
    query = this.addToQuery(query, 'limit', this.limit);
    query = this.addToQuery(query, 'direction', this.direction);

    return query
  }

  private addToQuery(query: string, key: string, value: string | number): string {
    if (!!value === false) return query;

    const leading = query.length > 0 ? '&' : '?';

    return `${query}${leading}${key}=${value}`;
  }
}
