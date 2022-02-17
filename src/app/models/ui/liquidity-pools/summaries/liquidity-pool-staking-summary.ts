import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IStakingSummaryResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface";

export class LiquidityPoolStakingSummary {
  private _weight: FixedDecimal;
  private _usd: FixedDecimal;
  private _dailyWeightChangePercent: FixedDecimal;
  private _nominated: boolean;

  public get weight(): FixedDecimal {
    return this._weight;
  }

  public get usd(): FixedDecimal {
    return this._usd;
  }

  public get dailyWeightChangePercent(): FixedDecimal {
    return this._dailyWeightChangePercent;
  }

  public get nominated(): boolean {
    return this._nominated;
  }

  constructor(staking: IStakingSummaryResponse) {
    if (!!staking === false) return;

    this._weight = new FixedDecimal(staking.weight, staking.weight.split('.')[1].length);
    this._usd = new FixedDecimal(staking.usd, 8);
    this._dailyWeightChangePercent = new FixedDecimal(staking.dailyWeightChangePercent, 8);
    this._nominated = staking.nominated;
  }
}
