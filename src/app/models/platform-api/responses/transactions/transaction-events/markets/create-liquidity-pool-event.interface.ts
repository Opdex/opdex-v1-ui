import { ITransactionEvent } from "../transaction-event.interface";

export interface ICreateLiquidityPoolEvent extends ITransactionEvent {
  liquidityPool: string;
  token: string;
}
