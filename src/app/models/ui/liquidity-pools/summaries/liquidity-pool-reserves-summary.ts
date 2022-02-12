import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IReservesSummaryResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface";

export class LiquidityPoolReservesSummary {
  private _crs: FixedDecimal;
  private _src: FixedDecimal;
  private _usd: number;
  private _dailyUsdChangePercent: number;

  public get crs(): FixedDecimal {
    return this._crs;
  }

  public get src(): FixedDecimal {
    return this._src;
  }

  public get usd(): number {
    return this._usd;
  }

  public get dailyUsdChangePercent(): number {
    return this._dailyUsdChangePercent;
  }

  constructor(reserves: IReservesSummaryResponse) {
    this._crs = new FixedDecimal(reserves.crs, 8);
    this._src = new FixedDecimal(reserves.src, reserves.src.split('.')[1].length);
    this._usd = reserves.usd;
    this._dailyUsdChangePercent = reserves.dailyUsdChangePercent;
  }
}
