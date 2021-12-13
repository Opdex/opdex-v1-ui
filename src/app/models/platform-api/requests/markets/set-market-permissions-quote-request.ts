import { MarketPermissionTypes } from "src/app/enums/market-permission-types";

export interface ISetMarketPermissionsQuoteRequest {
  permission: number;
  authorize: boolean;
}

export class SetMarketPermissionsQuoteRequest {
  private _permission: MarketPermissionTypes;
  private _authorize: boolean;

  public get payload(): ISetMarketPermissionsQuoteRequest {
    return {
      permission: this._permission,
      authorize: this._authorize
    }
  }

  constructor(permission: MarketPermissionTypes, authorize: boolean) {
    this._permission = permission;
    this._authorize = authorize;
  }
}
