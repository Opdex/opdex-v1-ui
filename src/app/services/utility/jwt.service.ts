import { EnvironmentsService } from './environments.service';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageService } from './storage.service';

const _jwt = new JwtHelperService();

@Injectable()
export class JwtService {
  private storageKey = 'jwt';

  constructor(private _storage: StorageService, private _env: EnvironmentsService) { }

  public getAllowedDomain(): string {
    return this._env.apiUrl.replace('https://', '').replace('http://', '');
  }

  /**
   * @summary Decodes the current users JWT
   */
  public decodeToken() {
    const token = this.getToken();
    return _jwt.decodeToken(token);
  }

  /**
   * @summary Get the expiration date of the current users JWT
   */
  public getTokenExpirationDate(): Date {
    const token = this.getToken();

    return _jwt.getTokenExpirationDate(token);
  }

  /**
   * @summary check if a JWT is expired
   * @param offsetSeconds optional offset to check expiration
   * @returns boolean value
   */
  public isTokenExpired(offsetSeconds?: number): boolean {
    const token = this.getToken();

    return _jwt.isTokenExpired(token, offsetSeconds);
  }

  /**
   * @summary gets the current JWT from local storage
   * @returns JWT string
   */
  public getToken(): string {
    return this._storage.getLocalStorage<any>(this.storageKey);
  }

  /**
   * @summary removes the current JWT from local storage
   */
   public removeToken(): void {
    this._storage.removeLocalStorage(this.storageKey);
  }

  /**
   * @summary sets the current JWT to local storage
   * @returns JWT string
   */
   public setToken(data: any): void {
    this._storage.setLocalStorage(this.storageKey, data);
  }

  /**
   * @summary checks if the current JWT is expired
   * @returns boolean as success
   */
  public isAuthorized(): boolean {
    return this.isTokenExpired() === false;
  }
}

export function jwtOptionsFactory(jwtService: JwtService) {
  return {
    tokenGetter: () => jwtService.getToken(),
    allowedDomains: [jwtService.getAllowedDomain()]
  }
}
