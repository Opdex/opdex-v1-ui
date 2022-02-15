import { IOhlcNumber } from './../Ohlc.interface';

export interface ITokenGroup {
  crs: IToken;
  src: IToken;
  lp: IToken;
  staking?: IToken;
}

export interface ITokenSummary {
  priceUsd: number;
  dailyPriceChangePercent: number;
  createdBlock: number;
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
  attributes: string[];
  createdBlock: number;
  modifiedBlock: number;
  wrappedToken?: IWrappedToken;
  distribution?: ITokenDistribution;
  balance?: any;
}

export interface IWrappedToken {
  custodian: string;
  chain: string;
  address: string;
  validated: boolean;
  trusted: boolean;
  createdBlock: number;
  modifiedBlock: number;
}
export interface ITokenSnapshot {
  price: IOhlcNumber;
  timestamp: Date;
}

export interface ITokenDistribution {
  vault: string;
  miningGovernance: string;
  nextDistributionBlock: number;
  history: ITokenDistributionHistory[];
}

export interface ITokenDistributionHistory {
  vault: string;
  miningGovernance: string;
  block: number;
}
