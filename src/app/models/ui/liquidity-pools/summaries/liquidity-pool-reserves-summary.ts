import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IReservesSummaryResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface";

export class LiquidityPoolReservesSummary {
  private _crs: FixedDecimal;
  private _src: FixedDecimal;
  private _usd: FixedDecimal;
  private _dailyUsdChangePercent: FixedDecimal;

  public get crs(): FixedDecimal {
    return this._crs;
  }

  public get src(): FixedDecimal {
    return this._src;
  }

  public get usd(): FixedDecimal {
    return this._usd;
  }

  public get dailyUsdChangePercent(): FixedDecimal {
    return this._dailyUsdChangePercent;
  }

  constructor(reserves: IReservesSummaryResponse) {
    this._crs = new FixedDecimal(reserves.crs, 8);
    this._src = new FixedDecimal(reserves.src, reserves.src.split('.')[1].length);
    this._usd = new FixedDecimal(reserves.usd, 8);
    this._dailyUsdChangePercent = new FixedDecimal(reserves.dailyUsdChangePercent, 8);
  }
}
