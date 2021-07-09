import { IToken } from "../Pools/liquidity-pool.interface";

export interface IGovernanceResponseModel {
  address: string;
  periodEndBlock: number;
  periodRemainingBlocks: number;
  periodBlockDuration: number;
  periodsUntilRewardReset: number;
  miningPoolRewardPerPeriod: string;
  totalRewardsPerPeriod: string;
  minedToken: IToken;
}
