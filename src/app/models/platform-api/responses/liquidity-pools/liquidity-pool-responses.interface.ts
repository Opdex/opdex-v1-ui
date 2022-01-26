import { IToken, ITokenGroup } from "../tokens/token.interface";
import { IPaging } from '../paging.interface';

export interface ILiquidityPoolsResponse extends IPaging<ILiquidityPoolResponse> { }

export interface ILiquidityPoolResponse {
  address: string;
  name: string;
  transactionFeePercent: number;
  market: string;
  tokens: ITokenGroup;
  miningPool: IMiningPool;
  summary: ILiquidityPoolSummaryResponse;
}

export interface ILiquidityPoolSummaryResponse {
  reserves: IReservesSummaryResponse;
  rewards: IRewardsSummaryResponse;
  staking: IStakingSummaryResponse;
  volume: IVolumeSummaryResponse;
  cost: ICostSummaryResponse;
}

export interface IReservesSummaryResponse {
  crs: string;
  src: string;
  usd: number;
  dailyUsdChangePercent: number;
}

export interface IRewardsSummaryResponse {
  providerDailyUsd: number;
  marketDailyUsd: number;
  totalDailyUsd: number;
}

export interface IVolumeSummaryResponse {
  dailyUsd: number;
}

export interface IStakingSummaryResponse {
  token: IToken;
  weight: string;
  usd: number;
  dailyWeightChangePercent: number;
  nominated: boolean;
}

export interface ICostSummaryResponse {
  crsPerSrc: string;
  srcPerCrs: string;
}

export interface IMiningPool {
  address: string;
  liquidityPool: string;
  rewardPerBlock: string;
  miningPeriodEndBlock: number;
  rewardPerLpt: string;
  tokensMining: string;
  isActive: boolean;
}
