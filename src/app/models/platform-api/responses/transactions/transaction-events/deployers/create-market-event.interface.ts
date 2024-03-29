import { ITransactionEvent } from '../transaction-event.interface';

export interface ICreateMarketEvent extends ITransactionEvent {
  market: string;
  owner: string;
  router: string;
  authPoolCreators: boolean;
  authProviders: boolean;
  authTraders: boolean;
  transactionFeePercent: string;
  stakingToken: string;
  enableMarketFee: boolean;
}
