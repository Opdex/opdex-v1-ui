import { ITransactionEvent } from "../transaction-event.interface";

export interface INominationEvent extends ITransactionEvent {
  stakingPool: string;
  miningPool: string;
  weight: string;
}
