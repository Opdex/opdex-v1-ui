import { ITransactionEvent } from "../transaction-event.interface";

export interface IRewardMiningPoolEvent extends ITransactionEvent {
  stakingPool: string;
  miningPool: string;
  amount: string;
}
