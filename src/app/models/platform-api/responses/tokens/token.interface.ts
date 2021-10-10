import { IOhlc } from "../liquidity-pools/liquidity-pool.interface";

export interface ITokenGroup {
  crs: IToken;
  src: IToken;
  lp: IToken;
  staking?: IToken;
}

export interface IToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  sats: number;
  totalSupply: string;
  summary: ITokenSnapshot;
  balance?: any;
}

export interface ITokenSnapshot {
  price: IOhlc;
  startDate: Date;
  endDate: Date;
  dailyPriceChange?: number;
}
