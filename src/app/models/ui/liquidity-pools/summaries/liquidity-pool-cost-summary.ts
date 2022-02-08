import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { ICostSummaryResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface";

export class LiquidityPoolCostSummary {
  private _crsPerSrc: FixedDecimal;
  private _srcPerCrs: FixedDecimal;

  public get crsPerSrc(): FixedDecimal {
    return this._crsPerSrc;
  }

  public get srcPerCrs(): FixedDecimal {
    return this._srcPerCrs;
  }

  constructor(cost: ICostSummaryResponse) {
    this._crsPerSrc = new FixedDecimal(cost.crsPerSrc, 8);
    this._srcPerCrs = new FixedDecimal(cost.srcPerCrs, cost.srcPerCrs.split('.')[1].length);
  }
}
