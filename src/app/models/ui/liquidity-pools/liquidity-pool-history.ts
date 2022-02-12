import { ILiquidityPoolSnapshotHistoryResponse } from "@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-snapshots-responses.interface";

export class LiquidityPoolHistory {
  liquidity: any;
  volume: any;
  staking: any;
  crsPerSrc: any;
  srcPerCrs: any;

  constructor(history: ILiquidityPoolSnapshotHistoryResponse) {
    const liquidity = [];
    const volume = [];
    const staking = [];
    const crsPerSrc = [];
    const srcPerCrs = [];

    history.results.forEach(history => {
      const time = Date.parse(history.timestamp.toString()) / 1000;

      liquidity.push({ time, value: history.reserves.usd.close });

      volume.push({ time, value: history.volume.usd });

      staking.push({ time, value: parseFloat(history.staking.weight.close.split('.')[0]) });

      crsPerSrc.push({
        time,
        open: history.cost.crsPerSrc.open,
        high: history.cost.crsPerSrc.high,
        low: history.cost.crsPerSrc.low,
        close: history.cost.crsPerSrc.close,
      });

      srcPerCrs.push({
        time,
        open: history.cost.srcPerCrs.open,
        high: history.cost.srcPerCrs.high,
        low: history.cost.srcPerCrs.low,
        close: history.cost.srcPerCrs.close,
      })
    });

    this.liquidity = liquidity;
    this.volume = volume;
    this.staking = staking;
    this.crsPerSrc = crsPerSrc;
    this.srcPerCrs = srcPerCrs;
  }
}
