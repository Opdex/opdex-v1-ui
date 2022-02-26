import { DataPoint } from './../charts/data-point';
import { LiquidityPool } from './liquidity-pool';
import { ILiquidityPoolSnapshotHistoryResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-snapshots-responses.interface";
import { OhlcPoint } from "../charts/ohlc-point";
import { IChartsSnapshotHistory, IChartData } from "../markets/market-history";

// Todo: Append new points
// Todo: Prepend older points
export class LiquidityPoolSnapshotHistory implements IChartsSnapshotHistory {
  charts: IChartData[] = [];

  constructor(pool: LiquidityPool, snapshots: ILiquidityPoolSnapshotHistoryResponse) {
    this.charts.push({
      label: 'Liquidity',
      labelPrefix: '$',
      labelSuffix: '',
      chartTypes: ['Line', 'Candle'],
      timeSpans: ['1D'],
      values: snapshots.results.map(result =>
        new OhlcPoint(result.reserves.usd, result.timestamp, 8))
    });

    this.charts.push({
      label: 'Volume',
      labelPrefix: '$',
      labelSuffix: '',
      chartTypes: ['Volume'],
      timeSpans: ['1D'],
      values: snapshots.results.map(result =>
        new DataPoint(result.volume.usd, result.timestamp, 8))
    });

    if (pool.hasStaking) {
      this.charts.push({
        label: 'Staking',
        labelPrefix: '',
        labelSuffix: pool.tokens.staking.symbol,
        chartTypes: ['Line', 'Candle'],
        timeSpans: ['1D'],
        values: snapshots.results.map(result =>
          new OhlcPoint(result.staking.weight, result.timestamp, pool.tokens.staking.decimals))
      });
    }

    this.charts.push({
      label: `${pool.tokens.src.symbol}/${pool.tokens.crs.symbol}`,
      labelPrefix: '',
      labelSuffix: pool.tokens.crs.symbol,
      chartTypes: ['Line', 'Candle'],
      timeSpans: ['1D'],
      values: snapshots.results.map(result =>
        new OhlcPoint(result.cost.crsPerSrc, result.timestamp, pool.tokens.crs.decimals))
    });

    this.charts.push({
      label: `${pool.tokens.crs.symbol}/${pool.tokens.src.symbol}`,
      labelPrefix: '',
      labelSuffix: pool.tokens.src.symbol,
      chartTypes: ['Line', 'Candle'],
      timeSpans: ['1D'],
      values: snapshots.results.map(result =>
        new OhlcPoint(result.cost.srcPerCrs, result.timestamp, pool.tokens.src.decimals))
    });
  }
}
