import { IMarketSummaryResponse } from './market-summary-response.interface';
import { IToken } from "../tokens/token.interface";

export interface IMarket {
  address: string;
  owner: string;
  stakingToken: IToken;
  crsToken: IToken;
  authPoolCreators: boolean;
  authTraders: boolean;
  authProviders: boolean;
  marketFeeEnabled: boolean;
  transactionFeePercent: number;
  summary: IMarketSummaryResponse;
  createdBlock: number;
  modifiedBlock: number;
}
