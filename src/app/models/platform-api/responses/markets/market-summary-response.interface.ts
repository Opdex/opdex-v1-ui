export interface IMarketSummaryResponse {
  liquidityUsd: string;
  dailyLiquidityUsdChangePercent: string;
  volumeUsd: string;
  staking: IMarketStakingResponse;
  rewards: IMarketRewardsResponse;
  createdBlock: number;
  modifiedBlock: number;
}

export interface IMarketStakingResponse {
  stakingWeight: string;
  dailyStakingWeightChangePercent: string;
  stakingUsd: string;
  dailyStakingUsdChangePercent: string;
}

export interface IMarketRewardsResponse {
  providerDailyUsd: string;
  marketDailyUsd: string;
  totalDailyUsd: string;
}
