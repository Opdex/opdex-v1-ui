import { IPaging } from "../paging.interface";

export interface IMiningPool {
  address: string;
  liquidityPool: string;
  miningPeriodEndBlock: number;
  rewardPerBlock: string;
  rewardPerLpt: string;
  tokensMining: string;
  isActive: boolean;
}

export interface IMiningPools extends IPaging<IMiningPool> { }
