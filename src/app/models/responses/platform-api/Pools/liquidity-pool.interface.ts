export interface ILiquidityPoolSummaryResponse extends ILiquidityPoolSummary {
  address: string;
  token: ITokenGroup;
  mining: IMiningPool;
  snapshotHistory?: ILiquidityPoolSnapshot[];
}

export interface ILiquidityPoolSnapshotHistoryResponse {
  address: string,
  snapshotHistory: ILiquidityPoolSnapshot[];
}

export interface ILiquidityPoolSummary {
  transactionCount: number;
  reserves: IReserves;
  rewards: IRewards;
  staking: IStaking;
  volume: IVolume;
  cost: ICost;
}

export interface ILiquidityPoolSnapshot extends ILiquidityPoolSummary {
  startDate: Date;
  endDate: Date;
}

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
}

export interface IOhlc {
  open: string | number;
  high: string | number;
  low: string | number;
  close: string | number;
}

export interface ITokenSnapshot {
  price: IOhlc;
  startDate: Date;
  endDate: Date;
}

export interface IReserves {
  crs: string;
  src: string;
  usd: number;
  usdDailyChange?: number;
}

export interface IRewards {
  providerUsd: number;
  marketUsd: number;
  totalUsd: number;
}

export interface IVolume {
  crs: string;
  src: string;
  usd: number;
}

export interface IStaking {
  weight: string;
  usd: number;
  weightDailyChange: number;
  isActive: boolean;
}

export interface ICost {
  crsPerSrc: IOhlc;
  srcPerCrs: IOhlc;
}

export interface IMiningPool {
  address: string;
  rewardPerBlock: string;
  miningPeriodEndBlock: number;
  rewardPerLpToken: string;
  tokensMining: string;
  isActive: boolean;
}
