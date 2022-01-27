import { IPaging } from "../paging.interface";

export interface IAddressMining {
  address: string;
  amount: string;
  miningPool: string;
  miningToken: string;
  createdBlock: number;
  modifiedBlock: number;
}

export interface IAddressMiningPositions extends IPaging<IAddressMining> { }
