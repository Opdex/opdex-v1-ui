export enum VaultProposalTypeFilter {
  create = 'Create',
  revoke = 'Revoke',
  totalPledgeMinimum = 'TotalPledgeMinimum',
  totalVoteMinimum = 'TotalVoteMinimum'
}

export enum VaultProposalStatusFilter {
  pledge = 'Pledge',
  vote = 'Vote',
  complete = 'Complete'
}

export interface IVaultProposalsFilter {
  status?: VaultProposalStatusFilter;
  type?: VaultProposalTypeFilter;
  limit?: number;
  direction?: string;
  cursor?: string;
}

export class VaultProposalsFilter implements IVaultProposalsFilter {
  status?: VaultProposalStatusFilter;
  type?: VaultProposalTypeFilter;
  limit?: number;
  direction?: string;
  cursor?: string;

  constructor(request?: IVaultProposalsFilter) {
    if (request === null || request === undefined) {
      this.limit = 5;
      this.direction = 'DESC';
      return;
    };

    this.type = request.type;
    this.status = request.status;
    this.cursor = request.cursor;
    this.limit = request.limit;
    this.direction = request.direction;
  }

  public buildQueryString(): string {
    if (this.cursor?.length) return `?cursor=${this.cursor}`;

    let query = '';

    query = this.addToQuery(query, 'status', this.status);
    query = this.addToQuery(query, 'type', this.type);
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
