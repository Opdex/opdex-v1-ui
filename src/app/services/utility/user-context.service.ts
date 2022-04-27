import { IAuthResponse } from '@sharedModels/auth-api/auth-response.interface';
import { UserContext, UserContextPreferences } from '@sharedModels/user-context';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtService } from './jwt.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private _context = new UserContext();
  private _context$ = new BehaviorSubject<UserContext>(this._context);

  constructor(
    private _jwtService: JwtService,
    private _storage: StorageService
  ) { }

  get context$(): Observable<UserContext> {
    return this._context$.asObservable();
  }

  get accessToken(): string {
    return this._jwtService.accessToken;
  }

  get userContext(): UserContext {
    return this._context;
  }

  set(resp: IAuthResponse): void {
    this._jwtService.set(resp);
    this._context = this._buildUserContext();
    this._context$.next(this._context)
  }

  remove(): void {
    this._jwtService.remove();
    this._context = new UserContext();
    this._context$.next(this._context);
  }

  setUserPreferences(wallet: string, preferences: UserContextPreferences): void {
    this._storage.setLocalStorage(wallet, preferences, true);
    this._context$.next(this.userContext)
  }

  private _buildUserContext(): UserContext {
    if (!this._jwtService.jwt) return new UserContext();

    const { wallet } = this._jwtService.jwt;

    let preferences = new UserContextPreferences();

    if (wallet) {
      preferences = this._storage.getLocalStorage(wallet, true);
    }

    return new UserContext(wallet, preferences);
  }
}
