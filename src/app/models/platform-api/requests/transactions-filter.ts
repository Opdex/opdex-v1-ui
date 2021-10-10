export interface ITransactionsRequest {
  contracts?: string[];
  eventTypes?: string[];
  wallet?: string;
  limit?: number;
  direction?: string;
  next?: string;
  previous?: string;
}

export class TransactionRequest implements ITransactionsRequest {
  contracts?: string[];
  eventTypes?: string[];
  wallet?: string;
  next?: string;
  previous?: string;
  limit: number;
  direction: string;

  constructor(request?: ITransactionsRequest) {
    if (request === null || request === undefined) {
      // Set mandatory parameters
      this.limit = 10;
      this.direction = "DESC";
      return;
    };

    this.contracts = request.contracts;
    this.eventTypes = request.eventTypes;
    this.wallet = request.wallet;
    this.next = request.next;
    this.previous = request.previous;
    this.limit = request.limit;
    this.direction = request.direction;
  }

  public buildQueryString(): string {
    if (this.next?.length) return `?cursor=${this.next}`;
    if (this.previous?.length) return `?cursor=${this.previous}`;

    var query = '';

    if (this.contracts?.length > 0) {
      this.contracts.forEach(contract => query = this.addToQuery(query, "contracts", contract));
    }

    if (this.eventTypes?.length > 0) {
      this.eventTypes.forEach(event => query = this.addToQuery(query, "eventTypes", event));
    }

    query = this.addToQuery(query, "wallet", this.wallet);
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
