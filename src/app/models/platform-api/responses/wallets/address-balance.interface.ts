import { IPaging } from "../paging.interface";

export interface IAddressBalance {
  owner: string;
  token: string;
  balance: string;
  createdBlock: number;
  modifiedBlock: number;
}

export interface IAddressBalances extends IPaging<IAddressBalance> { }
