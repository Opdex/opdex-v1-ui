import { IMarketSummaryResponse } from './market-summary-response.interface';
import { IToken } from "../tokens/token.interface";

export interface IMarket {
  address: string;
  owner: string;
  tokens: IMarketTokenGroupResponse;
  authPoolCreators: boolean;
  authTraders: boolean;
  authProviders: boolean;
  marketFeeEnabled: boolean;
  transactionFeePercent: string;
  summary: IMarketSummaryResponse;
  createdBlock: number;
  modifiedBlock: number;
}

export interface IMarketTokenGroupResponse {
  staking: IToken;
  crs: IToken;
}
