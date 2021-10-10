import { ITransactionEvent } from "../transaction-event.interface";

export interface ICollectMiningRewardsEvent extends ITransactionEvent {
  miner: string;
  amount: string;
}
