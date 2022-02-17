import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IMarketStakingResponse } from '@sharedModels/platform-api/responses/markets/market-summary-response.interface';

export class MarketStakingSummary {
  private _stakingWeight: FixedDecimal;
  private _dailyStakingWeightChangePercent: FixedDecimal;
  private _stakingUsd: FixedDecimal;
  private _dailyStakingUsdChangePercent: FixedDecimal;

  public get stakingWeight(): FixedDecimal {
    return this._stakingWeight;
  }

  public get dailyStakingWeightChangePercent(): FixedDecimal {
    return this._dailyStakingWeightChangePercent;
  }

  public get stakingUsd(): FixedDecimal {
    return this._stakingUsd;
  }

  public get dailyStakingUsdChangePercent(): FixedDecimal {
    return this._dailyStakingUsdChangePercent;
  }

  constructor(staking: IMarketStakingResponse) {
    this._stakingWeight = new FixedDecimal(staking.stakingWeight, staking.stakingWeight.split('.')[1].length);
    this._dailyStakingWeightChangePercent = new FixedDecimal(staking.dailyStakingWeightChangePercent, 8);
    this._stakingUsd = new FixedDecimal(staking.stakingUsd, 8);
    this._dailyStakingUsdChangePercent = new FixedDecimal(staking.dailyStakingUsdChangePercent, 8);
  }
}
