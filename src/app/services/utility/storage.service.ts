import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Network } from 'src/app/enums/networks';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  keyPrefix: string;

  constructor() {
    const network = environment.network === Network.Devnet
      ? environment.network.substring(0, 3).toLowerCase()
      : environment.network.substring(0, 4).toLowerCase();

    this.keyPrefix = `odx-${network}-`;
  }

  private keyWithPrefix(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  /**
   * @summary Get a value form local storage based on the provided key
   * @param key The key to search local storage for
   * @param parse Defaults to true, set to false to not parse the value (e.g. expecting a string response)
   */
  getLocalStorage<T>(key: string, parse: boolean = true): T {
    const result = <string>localStorage.getItem(this.keyWithPrefix(key));

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

    localStorage.setItem(this.keyWithPrefix(key), dataString);
  }

  /**
   * @summary Remove an item from local storage
   * @param key The key to remove from local storage
   */
  removeLocalStorage(key: string): void {
    localStorage.removeItem(this.keyWithPrefix(key));
  }

  /**
   * @summary Get a value form session storage based on the provided key
   * @param key The key to search session storage for
   * @param parse Defaults to true, set to false to not parse the value (e.g. expecting a string response)
   */
  getSessionStorage<T>(key: string, parse: boolean = true): T {
    const result = <string>sessionStorage.getItem(this.keyWithPrefix(key));

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

    sessionStorage.setItem(this.keyWithPrefix(key), dataString);
  }

  /**
   * @summary Remove an item from session storage
   * @param key The key to remove from session storage
   */
  removeSessionStorage(key: string): void {
    sessionStorage.removeItem(this.keyWithPrefix(key));
  }
}
