import { IOhlc } from './../Ohlc.interface';

export interface IMarketSnapshot {
  liquidityUsd: IOhlc;
  volumeUsd: string;
  staking: any;
  rewards: any;
  timestamp: Date;
}
