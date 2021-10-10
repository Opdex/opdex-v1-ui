import { IPaging } from "../paging.interface";

export interface IVault {
  address: string;
  owner: string;
  genesis: number;
  tokensLocked: string;
  tokensUnassigned: string;
  lockedToken: any; // This should have a separate Vault class where lockedToken is ONLY IToken type. This interface should use string for the response address
}

export interface IVaults extends IPaging<IVault> { }
