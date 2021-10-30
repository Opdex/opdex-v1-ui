import { IMarketSnapshot } from './platform-api/responses/markets/market-snapshot.interface';

export class MarketHistory {
  liquidity: any;
  volume: any;
  staking: any;

  constructor(history: IMarketSnapshot[]) {
    const liquidity = [];
    const volume = [];
    const staking = [];

    history.forEach(history => {
      const time = Date.parse(history.startDate.toString()) / 1000;

      liquidity.push({ time, value: history.liquidity });

      volume.push({ time, value: history.volume });

      staking.push({ time, value: parseFloat(history.staking.weight.split('.')[0]) });
    });

    this.liquidity = liquidity;
    this.volume = volume;
    this.staking = staking;
  }
}
