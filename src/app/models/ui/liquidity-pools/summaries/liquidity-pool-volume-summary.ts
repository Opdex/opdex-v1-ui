import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IVolumeSummaryResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface";

export class LiquidityPoolVolumeSummary {
  private _dailyUsd: FixedDecimal;

  public get dailyUsd(): FixedDecimal {
    return this._dailyUsd;
  }

  constructor(volume: IVolumeSummaryResponse) {
    this._dailyUsd = new FixedDecimal(volume.dailyUsd.toFixed(8), 8);
  }
}
