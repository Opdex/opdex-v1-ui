import { IToken } from "../token.interface";

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
