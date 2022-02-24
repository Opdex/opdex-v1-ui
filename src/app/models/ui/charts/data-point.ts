import { FixedDecimal } from "@sharedModels/types/fixed-decimal";
import { HistogramData, LineData, Time } from "lightweight-charts";

export class DataPoint implements HistogramData, LineData {
  private _value: number;
  private _time: Time;

  public get value(): number {
    return this._value;
  }

  public get time(): Time {
    return this._time;
  }

  constructor(value: string, time: Date, decimals: number) {
    this._value = parseFloat(new FixedDecimal(value, decimals).formattedValue);
    this._time = Date.parse(time.toString()) / 1000 as Time;
  }
}
