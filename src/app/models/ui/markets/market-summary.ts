import { MarketStakingSummary } from '@sharedModels/ui/markets/market-staking-summary';
import { IMarketSummaryResponse } from '@sharedModels/platform-api/responses/markets/market-summary-response.interface';
import { MarketRewardsSummary } from '@sharedModels/ui/markets/market-rewards-summary';

export class MarketSummary {
  private _liquidityUsd: number;
  private _dailyLiquidityUsdChangePercent: number;
  private _volumeUsd: number;
  private _staking: MarketStakingSummary;
  private _rewards: MarketRewardsSummary;
  // Todo: API return
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get liquidityUsd(): number {
    return this._liquidityUsd;
  }

  public get dailyLiquidityUsdChangePercent(): number {
    return this._dailyLiquidityUsdChangePercent;
  }

  public get volumeUsd(): number {
    return this._volumeUsd;
  }

  public get staking(): MarketStakingSummary {
    return this._staking;
  }

  public get rewards(): MarketRewardsSummary {
    return this._rewards;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  constructor(summary: IMarketSummaryResponse) {
    this._liquidityUsd = summary.liquidityUsd;
    this._dailyLiquidityUsdChangePercent = summary.dailyLiquidityUsdChangePercent;
    this._volumeUsd = summary.volumeUsd;
    this._staking = new MarketStakingSummary(summary.staking);
    this._rewards = new MarketRewardsSummary(summary.rewards);
    // this._createdBlock = summary.createdBlock;
    this._modifiedBlock = summary.modifiedBlock;
  }
}
