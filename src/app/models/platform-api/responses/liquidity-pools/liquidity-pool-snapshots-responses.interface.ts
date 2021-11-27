import { IOhlcNumber, IOhlcString } from '../Ohlc.interface';
import { IPaging } from '../paging.interface';

export interface ILiquidityPoolSnapshotHistoryResponse extends IPaging<ILiquidityPoolSnapshotResponse> {}

export interface ILiquidityPoolSnapshotResponse {
  timestamp: Date;
  transactionCount: number;
  reserves: ILiquidityPoolSnapshotReservesResponse;
  rewards: ILiquidityPoolSnapshotRewardsResponse;
  volume: ILiquidityPoolSnapshotVolumeResponse;
  cost: ILiquidityPoolSnapshotCostResponse;
  staking: ILiquidityPoolSnapshotStakingResponse;
}

interface ILiquidityPoolSnapshotReservesResponse {
  crs: IOhlcString;
  src: IOhlcString;
  usd: IOhlcNumber;
}

interface ILiquidityPoolSnapshotRewardsResponse {
  providerUsd: number;
  marketUsd: number;
  totalUsd: number;
}

interface ILiquidityPoolSnapshotVolumeResponse {
  crs: string;
  src: string;
  usd: number;
}

interface ILiquidityPoolSnapshotCostResponse {
  crsPerSrc: IOhlcString;
  srcPerCrs: IOhlcString;
}

interface ILiquidityPoolSnapshotStakingResponse {
  weight: IOhlcString;
  usd: IOhlcNumber;
}
