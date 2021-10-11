export interface ILiquidityPoolsSearchFilter {
  nominated?: boolean;
  staking?: boolean;
  mining?: boolean;
  pools?: string[];
}

export class LiquidityPoolsSearchQuery {
  nominated?: boolean;
  staking?: boolean;
  mining?: boolean;
  sortBy: string;
  orderBy: string;
  skip: number;
  take: number;
  pools: string[];

  constructor(sortBy: string, orderBy: string, skip: number, take: number, filter?: ILiquidityPoolsSearchFilter) {
    this.sortBy = sortBy;
    this.orderBy = orderBy;
    this.skip = skip;
    this.take = take;
    this.nominated = filter?.nominated;
    this.staking = filter?.staking;
    this.mining = filter?.mining;
    this.pools = filter?.pools || [];
  }

  getQuery(): string {
    const mining = `mining=${this.mining || ''}`;
    const staking = `staking=${this.staking || ''}`;
    const nominated = `nominated=${this.nominated || ''}`;
    const skip = `skip=${this.skip}`;
    const take = `take=${this.take}`;
    const orderBy = `orderBy=${this.orderBy}`;
    const sortBy = `sortBy=${this.sortBy}`;

    let pools = ``;

    this.pools.forEach(pool => {
        pools = pools.length > 0 ? `${pools}&pools=${pool}` : `pools=${pool}`;
    })

    return `?${mining}&${staking}&${nominated}&${skip}&${take}&${orderBy}&${sortBy}&${pools}`;
  }
}
