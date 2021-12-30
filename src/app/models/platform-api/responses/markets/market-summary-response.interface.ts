export interface IMarketSummaryResponse {
  liquidityUsd: number;
  dailyLiquidityUsdChangePercent: number;
  volumeUsd: number;
  staking: IMarketStakingResponse;
  rewards: any;
}

export interface IMarketStakingResponse {
  stakingWeight: string;
  dailyStakingWeightChangePercent: number;
  stakingUsd: number;
  dailyStakingUsdChangePercent: number;
}
