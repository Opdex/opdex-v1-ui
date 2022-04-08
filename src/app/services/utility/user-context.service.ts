import { UserContext, UserContextPreferences } from '@sharedModels/user-context';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private userContext$ = new BehaviorSubject<UserContext>(new UserContext());
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

    const updatedContext = this.getUserContext();

    this.userContext$.next(updatedContext);
  }

  setUserPreferences(wallet: string, preferences: UserContextPreferences): void {
    this._storage.setLocalStorage(wallet, preferences, true);

    const updatedContext = this.getUserContext();

    this.userContext$.next(updatedContext)
  }

  getUserContext(): UserContext {
    const data = this._jwtService.decodeToken();

    if (!data) return new UserContext();

    let preferences = new UserContextPreferences();

    if (data.wallet) {
      preferences = this._storage.getLocalStorage(data?.wallet, true);
    }

    return new UserContext(data.wallet, preferences);
  }
}
