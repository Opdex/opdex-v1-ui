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
