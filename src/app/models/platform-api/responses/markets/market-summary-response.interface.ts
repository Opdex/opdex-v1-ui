export interface IMarketSummaryResponse {
  liquidityUsd: number;
  dailyLiquidityUsdChangePercent: number;
  volumeUsd: number;
  staking: IMarketStakingResponse;
  rewards: IMarketRewardsResponse;
  createdBlock: number;
  modifiedBlock: number;
}

export interface IMarketStakingResponse {
  stakingWeight: string;
  dailyStakingWeightChangePercent: number;
  stakingUsd: number;
  dailyStakingUsdChangePercent: number;
}

export interface IMarketRewardsResponse {
  providerDailyUsd: number;
  marketDailyUsd: number;
  totalDailyUsd: number;
}
