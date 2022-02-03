import { IPaging } from "../paging.interface";

export interface IMiningGovernance {
  address: string;
  periodEndBlock: number;
  periodRemainingBlocks: number;
  periodBlockDuration: number;
  periodsUntilRewardReset: number;
  miningPoolRewardPerPeriod: string;
  totalRewardsPerPeriod: string;
  minedToken: string;
  createdBlock: number;
  modifiedBlock: number;
}

export interface IMiningGovernances extends IPaging<IMiningGovernance> { }
