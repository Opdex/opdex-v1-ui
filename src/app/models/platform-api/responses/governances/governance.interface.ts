import { IPaging } from "../paging.interface";

export interface IGovernance {
  address: string;
  periodEndBlock: number;
  periodRemainingBlocks: number;
  periodBlockDuration: number;
  periodsUntilRewardReset: number;
  miningPoolRewardPerPeriod: string;
  totalRewardsPerPeriod: string;
  minedToken: string;
}

export interface IGovernances extends IPaging<IGovernance> { }
