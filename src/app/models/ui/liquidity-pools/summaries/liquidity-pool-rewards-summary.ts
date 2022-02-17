import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IRewardsSummaryResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface";

export class LiquidityPoolRewardsSummary {
  private _providerDailyUsd: FixedDecimal;
  private _marketDailyUsd: FixedDecimal;
  private _totalDailyUsd: FixedDecimal;

  public get providerDailyUsd(): FixedDecimal {
    return this._providerDailyUsd;
  }

  public get marketDailyUsd(): FixedDecimal {
    return this._marketDailyUsd;
  }

  public get totalDailyUsd(): FixedDecimal {
    return this._totalDailyUsd;
  }

  constructor(rewards: IRewardsSummaryResponse) {
    this._providerDailyUsd = new FixedDecimal(rewards.providerDailyUsd, 8);
    this._marketDailyUsd = new FixedDecimal(rewards.marketDailyUsd, 8);
    this._totalDailyUsd = new FixedDecimal(rewards.totalDailyUsd, 8);
  }
}
