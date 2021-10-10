import { IPaging } from "../paging.interface";

export interface IAddressBalance {
  owner: string;
  token: string;
  balance: string;
}

export interface IAddressBalances extends IPaging<IAddressBalance> { }
