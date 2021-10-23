import { IOhlc } from "../liquidity-pools/liquidity-pool.interface";

export interface ITokenGroup {
  crs: IToken;
  src: IMarketToken;
  lp: IMarketToken;
  staking?: IMarketToken;
}

export interface ITokenSummary {
  priceUsd: number;
  dailyPriceChangePercent: number;
  modifiedBlock: number;
}

export interface IMarketToken extends IToken {
  market: string;
  liquidityPool: string;
}

export interface IToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  sats: number;
  totalSupply: string;
  summary: ITokenSummary;
  balance?: any;
}

export interface ITokenSnapshot {
  price: IOhlc;
  startDate: Date;
  endDate: Date;
}
