import { IPaging } from '../paging.interface';

export interface IVaultCertificate {
  owner: string;
  amount: string;
  vestingStartBlock: number;
  vestingEndBlock: number;
  redeemed: boolean;
  revoked: boolean;
  createdBlock: number;
  modifiedBlock: number;
}

export interface IVaultCertificates extends IPaging<IVaultCertificate> { }
