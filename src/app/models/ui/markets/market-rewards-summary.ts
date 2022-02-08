import { IMarketRewardsResponse } from "@sharedModels/platform-api/responses/markets/market-summary-response.interface";

export class MarketRewardsSummary {
  private _providerDailyUsd: number;
  private _marketDailyUsd: number;
  private _totalDailyUsd: number;

  public get providerDailyUsd(): number {
    return this._providerDailyUsd;
  }

  public get marketDailyUsd(): number {
    return this._marketDailyUsd;
  }

  public get totalDailyUsd(): number {
    return this._totalDailyUsd;
  }

  constructor(rewards: IMarketRewardsResponse) {
    this._providerDailyUsd = rewards.providerDailyUsd;
    this._marketDailyUsd = rewards.marketDailyUsd;
    this._totalDailyUsd = rewards.totalDailyUsd;
  }
}
