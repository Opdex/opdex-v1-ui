export interface IAddTokenRequest {
  token: string;
}

export class AddTokenRequest {
  private _token: string;

  public get payload(): IAddTokenRequest {
    return {
      token: this._token
    }
  }

  constructor(token: string) {
    this._token = token;
  }
}
