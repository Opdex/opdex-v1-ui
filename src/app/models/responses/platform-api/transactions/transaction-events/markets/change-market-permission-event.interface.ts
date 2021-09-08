import { MarketPermissions } from "src/app/enums/market-permissions";
import { ITransactionEvent } from "../transaction-event.interface";

export interface IChangeMarketPermissionEvent extends ITransactionEvent {
  address: string;
  permission: MarketPermissions;
  isAuthorized: boolean;
}
