import { Token } from '@sharedModels/ui/tokens/token';
import { ITokenHistoryResponse } from '@sharedModels/platform-api/responses/tokens/token-history-response.interface';
import { OhlcPoint } from '../charts/ohlc-point';
import { IChartsSnapshotHistory, IChartData } from '../markets/market-history';

// Todo: Append new points
// Todo: Prepend older points
export class TokenSnapshotHistory implements IChartsSnapshotHistory {
  charts: IChartData[] = [];

  constructor(token: Token, snapshots: ITokenHistoryResponse) {
    this.charts.push({
      label: 'Price',
      labelPrefix: '$',
      labelSuffix: '',
      chartTypes: ['Line', 'Candle'],
      timeSpans: ['1D'],
      values: snapshots.results.map(result =>
        new OhlcPoint(result.price, result.timestamp, token.decimals))
    });
  }
}
