import { UserContext, UserContextPreferences } from '@sharedModels/user-context';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtService } from './jwt.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private _userContext$ = new BehaviorSubject<UserContext>(new UserContext());
  private _token: string;

  constructor(
    private _jwtService: JwtService,
    private _storage: StorageService
  ) { }

  get userContext$(): Observable<UserContext> {
    return this._userContext$.asObservable();
  }

  get token(): string {
    return this._token || this._jwtService.getToken();
  }

  get userContext(): UserContext {
    const data = this._jwtService.decodeToken();

    if (!data) return new UserContext();

    let preferences = new UserContextPreferences();

    if (data.wallet) {
      preferences = this._storage.getLocalStorage(data.wallet, true);
    }

    return new UserContext(data.wallet, preferences);
  }

  setToken(token: string): void {
    this._token = token;
    this._jwtService.setToken(token);
    this._userContext$.next(this.userContext)
  }

  logout(): void {
    this._token = undefined;
    this._jwtService.setToken(undefined);
    this._userContext$.next(new UserContext());
  }

  setUserPreferences(wallet: string, preferences: UserContextPreferences): void {
    this._storage.setLocalStorage(wallet, preferences, true);
    this._userContext$.next(this.userContext)
  }
}
