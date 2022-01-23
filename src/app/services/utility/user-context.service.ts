import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { Injectable } from '@angular/core';

export interface IUserPreferences {
  theme: string;
  deadlineThreshold: number;
  toleranceThreshold: number;
}

@Injectable({ providedIn: 'root' })

export class UserContextService {
  private userContext$ = new BehaviorSubject<any>({});
  private _token: string;

  constructor(
    private _jwtService: JwtService,
    private _storage: StorageService
  ) { }

  getUserContext$() {
    return this.userContext$.asObservable();
  }

  getToken(): string {
    return this._token || this._jwtService.getToken();
  }

  setToken(token: string): void {
    this._token = token;

    this._jwtService.setToken(token);

    const data = this.getUserContext();

    this.userContext$.next(data);
  }

  setUserPreferences(wallet: string, preferences: IUserPreferences): void {
    this._storage.setLocalStorage(wallet, preferences, true);
  }

  getUserContext() {
    const data = this._jwtService.decodeToken();

    if (!data) return {};

    let preferences = {} as IUserPreferences;
    if (data.wallet) {
      preferences = this._storage.getLocalStorage(data?.wallet, true) || {} as IUserPreferences;
    }

    return {
      wallet: data.wallet,
      preferences
    };
  }
}
