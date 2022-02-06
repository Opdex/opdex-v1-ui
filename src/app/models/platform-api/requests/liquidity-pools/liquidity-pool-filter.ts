export interface ILiquidityPoolsFilter {
  keyword?: string;
  tokens?: string[];
  liquidityPools?: string[];
  markets?: string[];
  stakingStatus?: StakingStatus;
  miningStatus?: MiningStatus;
  nominationStatus?: NominationStatus;
  orderBy?: LpOrderBy;
  limit?: number;
  direction?: string;
  cursor?: string
}

export enum StakingStatus {
  Any = 'Any',
  Enabled = 'Enabled',
  Disabled = 'Disabled'
}

export enum MiningStatus {
  Any = 'Any',
  Enabled = 'Enabled',
  Disabled = 'Disabled'
}

export enum NominationStatus {
  Any = 'Any',
  Nominated = 'Nominated',
  Excluded = 'Excluded'
}

export enum LpOrderBy {
  Default = 'Default',
  Liquidity = 'Liquidity',
  Volume = 'Volume',
  StakingWeight = 'StakingWeight'
}

export class LiquidityPoolsFilter implements ILiquidityPoolsFilter {
  keyword: string;
  tokens?: string[];
  liquidityPools?: string[];
  markets?: string[];
  stakingStatus?: StakingStatus;
  miningStatus?: MiningStatus;
  nominationStatus?: NominationStatus;
  orderBy?: LpOrderBy;
  limit?: number;
  direction?: string;
  cursor?: string

  constructor(filter: ILiquidityPoolsFilter) {
    if (filter === null || filter === undefined) {
      this.limit = 5;
      this.direction = 'DESC';
      return;
    };

    this.keyword = filter.keyword;
    this.tokens = filter.tokens || [];
    this.markets = filter.markets || [];
    this.liquidityPools = filter.liquidityPools || [];
    this.stakingStatus = filter.stakingStatus;
    this.miningStatus = filter.miningStatus;
    this.nominationStatus = filter.nominationStatus;
    this.orderBy = filter.orderBy;
    this.limit = filter.limit;
    this.direction = filter.direction;
    this.cursor = filter.cursor;
  }

  buildQueryString(): string {
    if (this.cursor?.length) return `?cursor=${this.cursor}`;

    let query = '';

    if (this.tokens?.length > 0) {
      this.tokens.forEach(contract => query = this.addToQuery(query, 'tokens', contract));
    }

    if (this.liquidityPools?.length > 0) {
      this.liquidityPools.forEach(contract => query = this.addToQuery(query, 'liquidityPools', contract));
    }

    if (this.markets?.length > 0) {
      this.markets.forEach(contract => query = this.addToQuery(query, 'markets', contract));
    }

    query = this.addToQuery(query, 'keyword', this.keyword);
    query = this.addToQuery(query, 'stakingStatus', this.stakingStatus);
    query = this.addToQuery(query, 'miningStatus', this.miningStatus);
    query = this.addToQuery(query, 'nominationStatus', this.nominationStatus);
    query = this.addToQuery(query, 'orderBy', this.orderBy);
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
