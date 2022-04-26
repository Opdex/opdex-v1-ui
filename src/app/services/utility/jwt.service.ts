import { IAuthResponse } from '@sharedModels/auth-api/auth-response.interface';
import { EnvironmentsService } from './environments.service';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageService } from './storage.service';
import { JWT } from '@sharedModels/auth-api/jwt';
const _jwt = new JwtHelperService();

@Injectable()
export class JwtService {
  private _storageKey = 'refresh';
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
    return this._accessToken;
  }

  public get refreshToken(): string {
    return this._refreshToken || this._storage.getLocalStorage<string>(this._storageKey, false);
  }

  public get jwt(): JWT {
    return _jwt.decodeToken(this._accessToken) || {} as JWT;
  }

  public get isExpired(): boolean {
    return _jwt.isTokenExpired(this.accessToken);
  }

  public set({ accessToken, refreshToken }: IAuthResponse): void {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    this._storage.setLocalStorage(this._storageKey, refreshToken);
  }

  public remove(): void {
    this._accessToken = undefined;
    this._refreshToken = undefined;
    this._storage.removeLocalStorage(this._storageKey);
  }
}
