import { IPaging } from "../paging.interface";

export interface IAddressStaking {
  address: string;
  amount: string;
  liquidityPool: string;
  stakingToken: string;
}

export interface IAddressStakingPositions extends IPaging<IAddressStaking> { }
