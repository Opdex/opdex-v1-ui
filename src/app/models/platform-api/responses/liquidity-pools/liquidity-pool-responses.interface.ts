import { ITokenGroup } from "../tokens/token.interface";
import { IPaging } from '../paging.interface';
import { IMiningPool } from "../mining-pools/mining-pool.interface";

export interface ILiquidityPoolsResponse extends IPaging<ILiquidityPoolResponse> { }

export interface ILiquidityPoolResponse {
  address: string;
  name: string;
  transactionFeePercent: string;
  market: string;
  tokens: ITokenGroup;
  miningPool: IMiningPool;
  summary: ILiquidityPoolSummaryResponse;
  createdBlock: number;
  modifiedBlock: number;
}

export interface ILiquidityPoolSummaryResponse {
  reserves: IReservesSummaryResponse;
  rewards: IRewardsSummaryResponse;
  staking: IStakingSummaryResponse;
  volume: IVolumeSummaryResponse;
  cost: ICostSummaryResponse;
  createdBlock: number;
  modifiedBlock: number;
}

export interface IReservesSummaryResponse {
  crs: string;
  src: string;
  usd: string;
  dailyUsdChangePercent: string;
}

export interface IRewardsSummaryResponse {
  providerDailyUsd: string;
  marketDailyUsd: string;
  totalDailyUsd: string;
}

export interface IVolumeSummaryResponse {
  dailyUsd: string;
}

export interface IStakingSummaryResponse {
  weight: string;
  usd: string;
  dailyWeightChangePercent: string;
  nominated: boolean;
}

export interface ICostSummaryResponse {
  crsPerSrc: string;
  srcPerCrs: string;
}
