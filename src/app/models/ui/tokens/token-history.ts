import { ITokenHistoryResponse } from '@sharedModels/platform-api/responses/tokens/token-history-response.interface';

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
        value: history.price.close
      });

      candle.push({
        time: date,
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
