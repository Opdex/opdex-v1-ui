import { EnvironmentsService } from './environments.service';
import { Injectable } from '@angular/core';
import { Network } from 'src/app/enums/networks';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  keyPrefix: string;

  constructor(private _env: EnvironmentsService) {
    const network = this._env.network === Network.Devnet
      ? 'dev'
      : this._env.network === Network.Testnet
        ? 'test'
        : 'main';

    this.keyPrefix = `odx-${network}-`;
  }

  //
  // LOCAL STORAGE
  //

  /**
   * @summary Get a value form local storage based on the provided key
   * @param key The key to search local storage for
   * @param parse Defaults to true, set to false to not parse the value (e.g. expecting a string response)
   */
  getLocalStorage<T>(key: string, parse: boolean = true): T {
    const result = <string>localStorage.getItem(this._storageKey(key));

    return parse === true
      ? JSON.parse(result)
      : result;
  }

  /**
   * @summary Set a value in local storage based on the provided key and data
   * @param key The key to store in local storage by
   * @param data The data to persist
   * @param stringify Defaults to true, can be set to false if the provided data is already a string
   */
  setLocalStorage(key: string, data: any, stringify: boolean = true): void {
    let dataString = stringify
      ? JSON.stringify(data)
      : data as string;

    localStorage.setItem(this._storageKey(key), dataString);
  }

  /**
   * @summary Remove an item from local storage
   * @param key The key to remove from local storage
   */
  removeLocalStorage(key: string): void {
    localStorage.removeItem(this._storageKey(key));
  }

  //
  // SESSION STORAGE
  //

  /**
   * @summary Get a value form session storage based on the provided key
   * @param key The key to search session storage for
   * @param parse Defaults to true, set to false to not parse the value (e.g. expecting a string response)
   */
  getSessionStorage<T>(key: string, parse: boolean = true): T {
    const result = <string>sessionStorage.getItem(this._storageKey(key));

    return parse === true
      ? JSON.parse(result)
      : result;
  }

  /**
   * @summary Set a value in session storage based on the provided key and data
   * @param key The key to store in session storage by
   * @param data The data to persist
   * @param stringify Defaults to true, can be set to false if the provided data is already a string
   */
  setSessionStorage(key: string, data: any, stringify: boolean = true): void {
    let dataString = stringify
      ? JSON.stringify(data)
      : data as string;

    sessionStorage.setItem(this._storageKey(key), dataString);
  }

  /**
   * @summary Remove an item from session storage
   * @param key The key to remove from session storage
   */
  removeSessionStorage(key: string): void {
    sessionStorage.removeItem(this._storageKey(key));
  }

  //
  // HELPERS
  //

  private _storageKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }
}
