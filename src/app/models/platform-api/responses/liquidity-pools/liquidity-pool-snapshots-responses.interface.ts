import { IOhlc } from '../Ohlc.interface';
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
  crs: IOhlc;
  src: IOhlc;
  usd: IOhlc;
}

interface ILiquidityPoolSnapshotRewardsResponse {
  providerUsd: string;
  marketUsd: string;
  totalUsd: string;
}

interface ILiquidityPoolSnapshotVolumeResponse {
  crs: string;
  src: string;
  usd: string;
}

interface ILiquidityPoolSnapshotCostResponse {
  crsPerSrc: IOhlc;
  srcPerCrs: IOhlc;
}

interface ILiquidityPoolSnapshotStakingResponse {
  weight: IOhlc;
  usd: IOhlc;
}
