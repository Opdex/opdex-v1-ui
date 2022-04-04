export class AuthVerification {
  private _success: boolean;
  private _route: URL;

  public get success(): boolean {
    return this._success;
  }

  public get route(): URL {
    return this._route;
  }

  public get routePath(): string {
    return this._route?.pathname || '/';
  }

  public get routeQueryParams(): object {
    let queryParams = {};

    if (!this._route) return queryParams;

    this._route.searchParams.forEach((value: string, key: string) => {
      queryParams[key] = value
    });

    return queryParams;
  }

  constructor(success: boolean, route: URL) {
    this._success = success;
    this._route = route;
  }
}
