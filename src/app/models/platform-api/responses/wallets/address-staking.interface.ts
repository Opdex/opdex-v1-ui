import { IPaging } from "../paging.interface";

export interface IAddressStaking {
  address: string;
  amount: string;
  liquidityPool: string;
  stakingToken: string;
  createdBlock: number;
  modifiedBlock: number;
}

export interface IAddressStakingPositions extends IPaging<IAddressStaking> { }
