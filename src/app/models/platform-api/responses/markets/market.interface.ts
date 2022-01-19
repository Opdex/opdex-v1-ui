import { IMarketSummaryResponse } from './market-summary-response.interface';
import { IToken } from "../tokens/token.interface";

export interface IMarket {
  address: string;
  owner: string;
  stakingToken: IToken;
  crsToken: IToken;
  authPoolCreators: string;
  authTraders: string;
  authProviders: boolean;
  marketFeeEnabled: boolean;
  transactionFeePercent: number;
  summary: IMarketSummaryResponse;
}
