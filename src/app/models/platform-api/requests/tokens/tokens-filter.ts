export enum TokenOrderByTypes {
  Name = 'Name',
  Symbol = 'Symbol',
  Default = 'Default',
  PriceUsd = 'PriceUsd',
  DailyPriceChangePercent = 'DailyPriceChangePercent'
}

export enum TokenAttributes {
  Provisional = 'Provisional',
  NonProvisional = 'NonProvisional',
  Staking = 'Staking'
}

export interface ITokensRequest {
  tokens?: string[];
  tokenAttributes?: TokenAttributes[];
  includeZeroLiquidity?: boolean;
  orderBy?: TokenOrderByTypes;
  limit?: number;
  direction?: string;
  cursor?: string;
  keyword?: string;
}

export class TokensFilter implements ITokensRequest {
  keyword?: string;
  tokens?: string[];
  tokenAttributes?: TokenAttributes[];
  includeZeroLiquidity?: boolean;
  orderBy?: TokenOrderByTypes;
  limit?: number;
  direction?: string;
  cursor?: string;

  constructor(request?: ITokensRequest) {
    if (request === null || request === undefined) {
      this.limit = 5;
      this.direction = 'DESC';
      return;
    };

    this.keyword = request.keyword;
    this.tokens = request.tokens;
    this.tokenAttributes = request.tokenAttributes;
    this.orderBy = request.orderBy;
    this.includeZeroLiquidity = request.includeZeroLiquidity;
    this.cursor = request.cursor;
    this.limit = request.limit;
    this.direction = request.direction;
  }

  public buildQueryString(): string {
    if (this.cursor?.length) return `?cursor=${this.cursor}`;

    let query = '';

    if (this.tokens?.length > 0) {
      this.tokens.forEach(contract => query = this.addToQuery(query, 'tokens', contract));
    }

    if (this.tokenAttributes?.length > 0) {
      this.tokenAttributes.forEach(attribute => query = this.addToQuery(query, 'tokenAttributes', attribute));
    }

    query = this.addToQuery(query, 'keyword', this.keyword);
    query = this.addToQuery(query, 'includeZeroLiquidity', this.includeZeroLiquidity?.toString());
    query = this.addToQuery(query, 'orderBy', this.orderBy);
    query = this.addToQuery(query, 'limit', this.limit);
    query = this.addToQuery(query, 'direction', this.direction);

    return query
  }

  private addToQuery(query: string, key: string, value: string | number): string {
    if (value === null || value === undefined) return query;

    const leading = query.length > 0 ? '&' : '?';

    return `${query}${leading}${key}=${value}`;
  }
}
