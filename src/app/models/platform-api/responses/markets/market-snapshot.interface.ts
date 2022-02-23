import { IOhlc } from './../Ohlc.interface';

export interface IMarketSnapshot {
  liquidityUsd: IOhlc;
  volumeUsd: string;
  staking: IMarketStakingSnapshot;
  rewards: IMarketRewardsSnapshot;
  timestamp: Date;
}

export interface IMarketStakingSnapshot {
  usd: IOhlc;
  weight: IOhlc;
}

export interface IMarketRewardsSnapshot {
  marketUsd: string;
  providerUsd: string;
  totalUsd: string;
}
