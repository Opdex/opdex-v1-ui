import { IMarketHistoryResponse } from '@sharedModels/platform-api/responses/markets/market-history-response.interface';

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
