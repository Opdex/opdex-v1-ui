import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  /**
   * @summary Get a value form local storage based on the provided key
   * @param key The key to search local storage for
   * @param parse Defaults to true, set to false to not parse the value (e.g. expecting a string response)
   */
  getLocalStorage<T>(key: string, parse: boolean = true): T {
    const result = <string>localStorage.getItem(key);

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

    localStorage.setItem(key, dataString);
  }

  /**
   * @summary Remove an item from local storage
   * @param key The key to remove from local storage
   */
  removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * @summary Get a value form session storage based on the provided key
   * @param key The key to search session storage for
   * @param parse Defaults to true, set to false to not parse the value (e.g. expecting a string response)
   */
  getSessionStorage<T>(key: string, parse: boolean = true): T {
    const result = <string>sessionStorage.getItem(key);

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

    sessionStorage.setItem(key, dataString);
  }

  /**
   * @summary Remove an item from session storage
   * @param key The key to remove from session storage
   */
  removeSessionStorage(key: string): void {
    sessionStorage.removeItem(key);
  }
}
