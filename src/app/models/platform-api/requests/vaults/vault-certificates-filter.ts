export enum VaultCertificateStatusFilter {
  all = 'All',
  vesting = 'Vesting',
  redeemed = 'Redeemed',
  revoked = 'Revoked'
}

export interface IVaultCertificatesFilter {
  owner?: string;
  status?: VaultCertificateStatusFilter[];
  limit?: number;
  direction?: string;
  cursor?: string;
}

export class VaultCertificatesFilter implements IVaultCertificatesFilter {
  owner?: string;
  status?: VaultCertificateStatusFilter[];
  limit?: number;
  direction?: string;
  cursor?: string;

  constructor(request?: IVaultCertificatesFilter) {
    if (request === null || request === undefined) {
      this.limit = 5;
      this.direction = 'DESC';
      return;
    };

    this.owner = request.owner;
    this.status = request.status;
    this.cursor = request.cursor;
    this.limit = request.limit;
    this.direction = request.direction;
  }

  public buildQueryString(): string {
    if (this.cursor?.length) return `?cursor=${this.cursor}`;

    let query = '';

    if (this.status?.length > 0) {
      this.status.forEach(status => query = this.addToQuery(query, 'status', status));
    }

    query = this.addToQuery(query, 'owner', this.owner);
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
