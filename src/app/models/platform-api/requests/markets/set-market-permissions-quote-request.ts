import { MarketPermissionTypes } from "src/app/enums/market-permission-types";

export interface ISetMarketPermissionsQuoteRequest {
    permission: MarketPermissionTypes;
    authorize: boolean;
}