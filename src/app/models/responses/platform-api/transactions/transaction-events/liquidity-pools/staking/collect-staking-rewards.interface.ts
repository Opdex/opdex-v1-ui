import { ITransactionEvent } from "../../transaction-event.interface";

export interface ICollectStakingRewardsEvent extends ITransactionEvent {
  staker: string;
  amount: string;
}
