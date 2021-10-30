import { ITokenGroup } from "../tokens/token.interface";

export interface ILiquidityPoolSummary extends ILiquidityPoolSummaryBase {
  address: string;
  name: string;
  token: ITokenGroup;
  mining: IMiningPool;
  snapshotHistory?: ILiquidityPoolSnapshot[];
}

export interface ILiquidityPoolSnapshotHistory {
  address: string,
  snapshotHistory: ILiquidityPoolSnapshot[];
}

export interface ILiquidityPoolSummaryBase {
  transactionCount: number;
  transactionFee: number;
  reserves: IReserves;
  rewards: IRewards;
  staking: IStaking;
  volume: IVolume;
  cost: ICost;
}

export interface ILiquidityPoolSnapshot extends ILiquidityPoolSummaryBase {
  startDate: Date;
  endDate: Date;
}

export interface IOhlc {
  open: string | number;
  high: string | number;
  low: string | number;
  close: string | number;
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
  isNominated: boolean;
}

export interface ICost {
  crsPerSrc: IOhlc;
  srcPerCrs: IOhlc;
}

export interface IMiningPool {
  address: string;
  liquidityPool: string;
  rewardPerBlock: string;
  miningPeriodEndBlock: number;
  rewardPerLpToken: string;
  tokensMining: string;
  isActive: boolean;
}
