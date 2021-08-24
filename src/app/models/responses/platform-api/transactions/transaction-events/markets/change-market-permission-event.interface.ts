import { ITransactionEvent } from "../transaction-event.interface";

export interface IChangeMarketPermissionEvent extends ITransactionEvent {
  address: string;
  permission: string;
  isAuthorized: boolean;
}
