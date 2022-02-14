import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IMarketStakingResponse } from '@sharedModels/platform-api/responses/markets/market-summary-response.interface';

export class MarketStakingSummary {
  private _stakingWeight: FixedDecimal;
  private _dailyStakingWeightChangePercent: number;
  private _stakingUsd: FixedDecimal;
  private _dailyStakingUsdChangePercent: number;

  public get stakingWeight(): FixedDecimal {
    return this._stakingWeight;
  }

  public get dailyStakingWeightChangePercent(): number {
    return this._dailyStakingWeightChangePercent;
  }

  public get stakingUsd(): FixedDecimal {
    return this._stakingUsd;
  }

  public get dailyStakingUsdChangePercent(): number {
    return this._dailyStakingUsdChangePercent;
  }

  constructor(staking: IMarketStakingResponse) {
    this._stakingWeight = new FixedDecimal(staking.stakingWeight, staking.stakingWeight.split('.')[1].length);
    this._dailyStakingWeightChangePercent = staking.dailyStakingWeightChangePercent;
    this._stakingUsd = new FixedDecimal(staking.stakingUsd.toFixed(8), 8);
    this._dailyStakingUsdChangePercent = staking.dailyStakingUsdChangePercent;
  }
}
