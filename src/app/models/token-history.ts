import { ITokenSnapshotHistory } from './platform-api/responses/tokens/token.interface';

export class TokenHistory {
  line: any;
  candle: any;

  constructor(history: ITokenSnapshotHistory) {
    let line = [];
    let candle = [];

    history.snapshotHistory.forEach(history => {
      line.push({
        time: Date.parse(history.startDate.toString())/1000,
        value: history.price.close
      });

      candle.push({
        time: Date.parse(history.startDate.toString())/1000,
        open: history.price.open,
        high: history.price.high,
        low: history.price.low,
        close: history.price.close,
      });
    });

    this.line = line;
    this.candle = candle;
  }
}
