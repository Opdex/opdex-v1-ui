import { EnvironmentsService } from './environments.service';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageService } from './storage.service';


export function jwtOptionsFactory(jwtService: JwtService) {
  return {
    tokenGetter: () => jwtService.getToken(),
    allowedDomains: [...jwtService.allowedDomains]
  }
}

const _jwt = new JwtHelperService();

@Injectable()
export class JwtService {
  private _storageKey = 'jwt';

  constructor(
    private _storage: StorageService,
    private _env: EnvironmentsService
  ) { }

  public get allowedDomains(): string[] {
    const { host: platformHost } = new URL(this._env.platformApiUrl);
    const { host: authHost } = new URL(this._env.authApiUrl);
    return [ platformHost, authHost ];
  }

  /** Decodes the current users JWT */
  public decodeToken(): any {
    const token = this.getToken();
    return _jwt.decodeToken(token);
  }

  /** Get the expiration date of the current users JWT */
  public getTokenExpirationDate(): Date {
    const token = this.getToken();
    return _jwt.getTokenExpirationDate(token);
  }

  /**
   * Checks if a JWT is expired
   * @param offsetSeconds optional offset to check expiration
   */
  public isTokenExpired(offsetSeconds?: number): boolean {
    const token = this.getToken();
    return _jwt.isTokenExpired(token, offsetSeconds);
  }

  /** Rets the current JWT from local storage */
  public getToken(): string {
    return this._storage.getLocalStorage<any>(this._storageKey);
  }

  /** Removes the current JWT from local storage */
   public removeToken(): void {
    this._storage.removeLocalStorage(this._storageKey);
  }

  /** Sets the current JWT to local storage */
   public setToken(data: string): void {
    this._storage.setLocalStorage(this._storageKey, data);
  }

  /** Checks if the current JWT is expired */
  public isAuthorized(): boolean {
    return this.isTokenExpired() === false;
  }
}
