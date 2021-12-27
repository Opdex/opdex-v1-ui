export interface IMiningPositionsRequest {
  miningPools?: string[];
  liquidityPools?: string[];
  cursor?: string
  includeZeroAmounts?: boolean;
  limit?: number;
  direction?: string;
}

export class MiningPositionsFilter {
  miningPools?: string[];
  liquidityPools?: string[];
  cursor?: string
  includeZeroAmounts: boolean;
  limit: number;
  direction: string;

  constructor(request: IMiningPositionsRequest) {
    if (!!request === false) {
      this.limit = 5;
      this.direction = 'DESC';
      this.includeZeroAmounts = false;
      return;
    };

    this.miningPools = request.miningPools;
    this.liquidityPools = request.liquidityPools;
    this.includeZeroAmounts = request.includeZeroAmounts || false;
    this.cursor = request.cursor;
    this.limit = request.limit || 5;
    this.direction = request.direction || 'DESC';
  }

  buildQueryString(): string {
    if (this.cursor?.length) return `?cursor=${this.cursor}`;

    let query = '';

    if (this.miningPools?.length > 0) {
      this.miningPools.forEach(contract => query = this.addToQuery(query, 'miningPools', contract));
    }

    if (this.liquidityPools?.length > 0) {
      this.liquidityPools.forEach(contract => query = this.addToQuery(query, 'liquidityPools', contract));
    }

    query = this.addToQuery(query, 'includeZeroAmounts', this.includeZeroAmounts.toString());
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
