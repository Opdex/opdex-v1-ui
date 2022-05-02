import { IAuthResponse } from '@sharedModels/auth-api/auth-response.interface';
import { EnvironmentsService } from './environments.service';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageService } from './storage.service';
import { JWT } from '@sharedModels/auth-api/jwt';

const _jwt = new JwtHelperService();
const ACCESS_KEY = 'access';
const REFRESH_KEY = 'refresh';

@Injectable()
export class JwtService {
  private _accessToken: string;
  private _refreshToken: string;

  constructor(
    private _storage: StorageService,
    private _env: EnvironmentsService
  ) { }

  public get allowedDomains(): string[] {
    const { host: platformHost } = new URL(this._env.platformApiUrl);
    const { host: authHost } = new URL(this._env.authApiUrl);
    return [ platformHost, authHost ];
  }

  public get accessToken(): string {
    return this._accessToken || this._storage.getSessionStorage<string>(ACCESS_KEY);
  }

  public get refreshToken(): string {
    return this._refreshToken || this._storage.getLocalStorage<string>(REFRESH_KEY);
  }

  public get jwt(): JWT {
    return _jwt.decodeToken(this.accessToken) || {} as JWT;
  }

  public get isExpired(): boolean {
    return _jwt.isTokenExpired(this.accessToken);
  }

  public set({ access_token, refresh_token }: IAuthResponse): void {
    this._accessToken = access_token;
    this._refreshToken = refresh_token;
    this._storage.setSessionStorage(ACCESS_KEY, access_token);
    this._storage.setLocalStorage(REFRESH_KEY, refresh_token);
  }

  public remove(): void {
    this._accessToken = undefined;
    this._refreshToken = undefined;
    this._storage.removeLocalStorage(REFRESH_KEY);
    this._storage.removeSessionStorage(ACCESS_KEY);
  }
}
