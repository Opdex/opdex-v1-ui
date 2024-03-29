import { AuthGrantTypes } from "src/app/enums/auth-grant-types";

export class AuthRequest {
  private _request: URLSearchParams;

  get request(): URLSearchParams {
    return this._request;
  }

  constructor(code?: string, codeVerifier?: string, refreshToken?: string) {
    const grantType = refreshToken ? AuthGrantTypes.RefreshToken : AuthGrantTypes.AuthorizationCode;
    const request = new URLSearchParams();

    request.set('grantType', grantType);

    if (grantType === AuthGrantTypes.AuthorizationCode) {
      request.set('code', code);
      request.set('codeVerifier', codeVerifier);
    } else {
      request.set('refreshToken', refreshToken);
    }

    this._request = request;
  }
}
