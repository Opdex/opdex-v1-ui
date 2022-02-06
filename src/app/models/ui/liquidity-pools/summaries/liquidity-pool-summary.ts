import { LiquidityPoolCostSummary } from '@sharedModels/ui/liquidity-pools/summaries/liquidity-pool-cost-summary';
import { LiquidityPoolStakingSummary } from '@sharedModels/ui/liquidity-pools/summaries/liquidity-pool-staking-summary';
import { LiquidityPoolRewardsSummary } from '@sharedModels/ui/liquidity-pools/summaries/liquidity-pool-rewards-summary';
import { LiquidityPoolReservesSummary } from '@sharedModels/ui/liquidity-pools/summaries/liquidity-pool-reserves-summary';
import { ILiquidityPoolSummaryResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { LiquidityPoolVolumeSummary } from '@sharedModels/ui/liquidity-pools/summaries/liquidity-pool-volume-summary';

export class LiquidityPoolSummary {
  private _reserves: LiquidityPoolReservesSummary;
  private _rewards: LiquidityPoolRewardsSummary;
  private _staking: LiquidityPoolStakingSummary;
  private _volume: LiquidityPoolVolumeSummary;
  private _cost: LiquidityPoolCostSummary;
  private _createdBlock: number;
  private _modifiedBlock: number;

  public get reserves(): LiquidityPoolReservesSummary {
    return this._reserves;
  }

  public get rewards(): LiquidityPoolRewardsSummary {
    return this._rewards;
  }

  public get staking(): LiquidityPoolStakingSummary {
    return this._staking;
  }

  public get volume(): LiquidityPoolVolumeSummary {
    return this._volume;
  }

  public get cost(): LiquidityPoolCostSummary {
    return this._cost;
  }

  public get createdBlock(): number {
    return this._createdBlock;
  }

  public get modifiedBlock(): number {
    return this._modifiedBlock;
  }

  constructor(summary: ILiquidityPoolSummaryResponse) {
    this._reserves = new LiquidityPoolReservesSummary(summary.reserves);
    this._rewards = new LiquidityPoolRewardsSummary(summary.rewards);
    this._staking = !!summary.staking ? new LiquidityPoolStakingSummary(summary.staking) : null;
    this._volume = new LiquidityPoolVolumeSummary(summary.volume);
    this._cost = new LiquidityPoolCostSummary(summary.cost);
    // Todo: API Return
    // this._createdBlock = summary.createdBlock;
    this._modifiedBlock = summary.modifiedBlock;
  }
}
