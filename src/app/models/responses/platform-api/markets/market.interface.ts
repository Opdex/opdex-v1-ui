import { IToken } from "../tokens/token.interface";
import { IMarketSnapshot } from "./market-snapshot.interface";

export interface IMarket {
  address: string;
  owner: string;
  stakingToken: IToken;
  crsToken: IToken;
  authPoolCreators: string;
  authTraders: string;
  authProviders: boolean;
  marketFeeEnabled: boolean;
  transactionFee: number;
  summary: IMarketSnapshot;
}
