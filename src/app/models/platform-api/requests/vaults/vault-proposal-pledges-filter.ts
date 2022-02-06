export interface IVaultProposalPledgesFilter {
  proposalId?: number;
  pledger?: string;
  includeZeroBalances?: boolean;
  limit?: number;
  direction?: string;
  cursor?: string;
}

export class VaultProposalPledgesFilter {
  proposalId?: number;
  pledger?: string;
  includeZeroBalances?: boolean;
  limit?: number;
  direction?: string;
  cursor?: string;

  constructor(request?: IVaultProposalPledgesFilter) {
    if (request === null || request === undefined) {
      this.limit = 5;
      this.direction = 'DESC';
      return;
    };

    this.proposalId = request.proposalId;
    this.pledger = request.pledger;
    this.includeZeroBalances = request.includeZeroBalances;
    this.cursor = this.cursor;
    this.limit = this.limit;
    this.direction = this.direction;
  }

  public buildQueryString(): string {
    if (this.cursor?.length) return `?cursor=${this.cursor}`;

    let query = '';

    query = this.addToQuery(query, 'proposalId', this.proposalId);
    query = this.addToQuery(query, 'pledger', this.pledger);
    if (!!this.includeZeroBalances) {
      query = this.addToQuery(query, 'includeZeroBalances', this.includeZeroBalances.toString());
    }
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
