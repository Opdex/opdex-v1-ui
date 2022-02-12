import { IVolumeSummaryResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface";

export class LiquidityPoolVolumeSummary {
  private _dailyUsd: number;

  public get dailyUsd(): number {
    return this._dailyUsd;
  }

  constructor(volume: IVolumeSummaryResponse) {
    this._dailyUsd = volume.dailyUsd;
  }
}
