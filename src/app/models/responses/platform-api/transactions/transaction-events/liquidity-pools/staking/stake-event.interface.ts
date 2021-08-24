import { ITransactionEvent } from "../../transaction-event.interface";

export interface IStakeEvent extends ITransactionEvent {
  staker: string;
  amount: string;
  stakerBalance: string;
  totalStaked: string;
}
