type AuthVerificationOptions = {
  route?: URL;
  error?: string | any;
}

export class AuthVerification {
  private _route: URL;
  private _error: string | any;

  public get success(): boolean {
    return !this._error;
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

  constructor(options: AuthVerificationOptions) {
    if (options.error) {
      console.error(options.error);
      this._error = options.error;
    } else {
      this._route = options.route;
    }
  }
}
