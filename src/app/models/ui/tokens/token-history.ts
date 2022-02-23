import { Token } from '@sharedModels/ui/tokens/token';
import { ITokenHistoryResponse } from '@sharedModels/platform-api/responses/tokens/token-history-response.interface';
import { OhlcPoint } from '../charts/ohlc-point';
import { IChartsSnapshotHistory, IChartData } from '../markets/market-history';

export class TokenHistory {
  line: any;
  candle: any;

  constructor(history: ITokenHistoryResponse) {
    let line = [];
    let candle = [];

    history.results.forEach(history => {
      const date = Date.parse(history.timestamp.toString()) / 1000;

      line.push({
        time: date,
        value: parseFloat(history.price.close)
      });

      candle.push({
        time: date,
        open: parseFloat(history.price.open),
        high: parseFloat(history.price.high),
        low: parseFloat(history.price.low),
        close: parseFloat(history.price.close)
      });
    });

    this.line = line;
    this.candle = candle;
  }
}

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
