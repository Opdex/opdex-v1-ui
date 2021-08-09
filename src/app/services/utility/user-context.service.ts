import { BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class UserContextService {
  private userContext$ = new BehaviorSubject<any>(null);
  private _token: string;

  constructor(private _jwtService: JwtService) { }

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

  getUserContext() {
    const data = this._jwtService.decodeToken();

    if (!data) return null;

    return {
      market: data.market,
      wallet: data.wallet
    };
  }
}
