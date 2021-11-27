import { IOhlcNumber } from './../Ohlc.interface';

export interface IMarketSnapshot {
  liquidityUsd: IOhlcNumber;
  volumeUsd: number;
  staking: any;
  rewards: any;
  timestamp: Date;
}
