import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IOhlc } from '@sharedModels/platform-api/responses/Ohlc.interface';
import { IMarketHistoryResponse } from '@sharedModels/platform-api/responses/markets/market-history-response.interface';
import { BarData, Time, HistogramData } from 'lightweight-charts';

export class MarketHistory {
  liquidity: any;
  volume: any;
  staking: any;

  constructor(history: IMarketHistoryResponse) {
    const liquidity = [];
    const volume = [];
    const staking = [];

    history.results.forEach(history => {
      const time = Date.parse(history.timestamp.toString()) / 1000;

      liquidity.push({
        time,
        value: parseFloat(history.liquidityUsd.close)
      });

      volume.push({
        time,
        value: parseFloat(history.volumeUsd)
      });

      staking.push({
        time,
        value: parseFloat(history.staking.weight.close.split('.')[0])
      });
    });

    this.liquidity = liquidity;
    this.volume = volume;
    this.staking = staking;
  }
}

// Todo: Append new points
// Todo: Prepend older points
export class MarketSnapshotHistory implements IChartsSnapshotHistory {
  charts: IChartData[] = [];

  constructor(snapshots: IMarketHistoryResponse) {
    // Create Liquidity Charts
    this.charts.push({
      label: 'Liquidity',
      labelPrefix: '$',
      labelSuffix: '',
      chartTypes: ['Line', 'Candle'],
      timeSpans: ['1D'],
      values: snapshots.results.map(result =>
        new OhlcPoint(result.liquidityUsd, result.timestamp, 8))
    });

    // Create Volume Charts
    this.charts.push({
      label: 'Volume',
      labelPrefix: '$',
      labelSuffix: '',
      chartTypes: ['Volume'],
      timeSpans: ['1D'],
      values: snapshots.results.map(result =>
        new DataPoint(result.volumeUsd, result.timestamp, 8))
    });

    // Create Staking Charts
    // Todo: If Staking in market exists
    // TodO: Get actual staking token symbol
    this.charts.push({
      label: 'Staking',
      labelPrefix: '',
      labelSuffix: 'ODX',
      chartTypes: ['Line', 'Candle'],
      timeSpans: ['1D'],
      values: snapshots.results.map(result =>
        new OhlcPoint(result.staking.weight, result.timestamp, 8))
    });
  }
}

export interface IChartsSnapshotHistory {
  charts: IChartData[];
}

export interface IChartData {
  label: string;
  labelPrefix: string;
  labelSuffix: string;
  chartTypes: ('Volume' | 'Line' | 'Candle')[];
  timeSpans: ('1h' | '1D')[];
  values: BarData[] | OhlcPoint[] | DataPoint[];
}

export class DataPoint implements HistogramData {
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

export class OhlcPoint implements BarData {
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
