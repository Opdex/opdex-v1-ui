import { Market } from '@sharedModels/ui/markets/market';
import { LineData } from 'lightweight-charts';
import { IMarketHistoryResponse } from '@sharedModels/platform-api/responses/markets/market-history-response.interface';
import { BarData, HistogramData } from 'lightweight-charts';
import { DataPoint } from '../charts/data-point';
import { OhlcPoint } from '../charts/ohlc-point';
import { BaseHistory } from '@sharedModels/base-history';

// Todo: Append new points
// Todo: Prepend older points
export class MarketSnapshotHistory extends BaseHistory implements IChartsSnapshotHistory {
  charts: IChartData[] = [];

  constructor(market: Market, snapshots: IMarketHistoryResponse) {
    super();

    // Create Liquidity Charts
    this.charts.push({
      label: 'Liquidity',
      labelPrefix: '$',
      labelSuffix: '',
      chartTypes: ['Line', 'Candle'],
      timeSpans: ['1D'],
      values: this._removeZeros(snapshots.results.map(result =>
        new OhlcPoint(result.liquidityUsd, result.timestamp, 8)))
    });

    // Create Volume Charts
    this.charts.push({
      label: 'Volume',
      labelPrefix: '$',
      labelSuffix: '',
      chartTypes: ['Volume'],
      timeSpans: ['1D'],
      values: this._removeZeros(snapshots.results.map(result =>
        new DataPoint(result.volumeUsd, result.timestamp, 8)))
    });

    // Create Staking Charts
    if (market.isStaking) {
      this.charts.push({
        label: 'Staking',
        labelPrefix: '',
        labelSuffix: market.tokens.staking.symbol,
        chartTypes: ['Line', 'Candle'],
        timeSpans: ['1D'],
        values: this._removeZeros(snapshots.results.map(result =>
          new OhlcPoint(result.staking.weight, result.timestamp, market.tokens.staking.decimals)))
      });
    }
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
  values: BarData[] | HistogramData[] | LineData[];
}
