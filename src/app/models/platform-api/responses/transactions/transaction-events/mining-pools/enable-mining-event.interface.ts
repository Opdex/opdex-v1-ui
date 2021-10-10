import { ITransactionEvent } from "../transaction-event.interface";

export interface IEnableMiningEvent extends ITransactionEvent {
  amount: string;
  rewardRate: string;
  miningPeriodEndBlock: number;
}
