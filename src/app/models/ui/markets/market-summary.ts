import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MarketStakingSummary } from '@sharedModels/ui/markets/market-staking-summary';
import { IMarketSummaryResponse } from '@sharedModels/platform-api/responses/markets/market-summary-response.interface';
import { MarketRewardsSummary } from '@sharedModels/ui/markets/market-rewards-summary';

export class MarketSummary {
  private _liquidityUsd: FixedDecimal;
  private _dailyLiquidityUsdChangePercent: FixedDecimal;
  private _volumeUsd: FixedDecimal;
  private _staking: MarketStakingSummary;
  private _rewards: MarketRewardsSummary;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get liquidityUsd(): FixedDecimal {
    return this._liquidityUsd;
  }

  public get dailyLiquidityUsdChangePercent(): FixedDecimal {
    return this._dailyLiquidityUsdChangePercent;
  }

  public get volumeUsd(): FixedDecimal {
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
    this._liquidityUsd = new FixedDecimal(summary.liquidityUsd, 8);
    this._dailyLiquidityUsdChangePercent = new FixedDecimal(summary.dailyLiquidityUsdChangePercent, 8);
    this._volumeUsd = new FixedDecimal(summary.volumeUsd, 8);
    this._staking = new MarketStakingSummary(summary.staking);
    this._rewards = new MarketRewardsSummary(summary.rewards);
    this._createdBlock = summary.createdBlock;
    this._modifiedBlock = summary.modifiedBlock;
  }
}
