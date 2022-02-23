import { IOhlc } from "@sharedModels/platform-api/responses/Ohlc.interface";
import { FixedDecimal } from "@sharedModels/types/fixed-decimal";
import { BarData, LineData, Time } from "lightweight-charts";

export class OhlcPoint implements BarData, LineData {
  private _open: number;
  private _high: number;
  private _low: number;
  private _close: number;
  private _time: Time;

  public get open(): number {
    return this._open;
  }

  public get high(): number {
    return this._high;
  }

  public get low(): number {
    return this._low;
  }

  public get close(): number {
    return this._close;
  }

  public get value(): number {
    return this._close;
  }

  public get time(): Time {
    return this._time;
  }

  constructor(ohlc: IOhlc, time: Date, decimals: number) {
    decimals = decimals > 8 ? 8 : decimals;
    this._open = parseFloat(new FixedDecimal(ohlc.open, decimals).formattedValue);
    this._high = parseFloat(new FixedDecimal(ohlc.high, decimals).formattedValue);
    this._low = parseFloat(new FixedDecimal(ohlc.low, decimals).formattedValue);
    this._close = parseFloat(new FixedDecimal(ohlc.close, decimals).formattedValue);
    this._time = Date.parse(time.toString()) / 1000 as Time;
  }
}
