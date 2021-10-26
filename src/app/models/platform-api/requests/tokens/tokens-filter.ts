export interface ITokensRequest {
  tokens?: string[];
  provisional?: string;
  orderBy?: string;
  limit?: number;
  direction?: string;
  cursor?: string
}

export class TokensFilter implements ITokensRequest {
  tokens?: string[];
  provisional?: string;
  orderBy?: string;
  limit?: number;
  direction?: string;
  cursor?: string

  constructor(request?: ITokensRequest) {
    if (request === null || request === undefined) {
      this.limit = 5;
      this.direction = "DESC";
      return;
    };

    this.tokens = request.tokens;
    this.provisional = request.provisional;
    this.orderBy = request.orderBy;
    this.cursor = request.cursor;
    this.limit = request.limit;
    this.direction = request.direction;
  }

  public buildQueryString(): string {
    if (this.cursor?.length) return `?cursor=${this.cursor}`;

    var query = '';

    if (this.tokens?.length > 0) {
      this.tokens.forEach(contract => query = this.addToQuery(query, "tokens", contract));
    }

    query = this.addToQuery(query, "provisional", this.provisional);
    query = this.addToQuery(query, "orderBy", this.orderBy);
    query = this.addToQuery(query, "limit", this.limit);
    query = this.addToQuery(query, "direction", this.direction);

    return query
  }

  private addToQuery(query: string, key: string, value: string | number) {
    if (value === null || value === undefined) return query;

    var leading = query.length > 0 ? '&' : '?';

    return `${query}${leading}${key}=${value}`;
  }
}
