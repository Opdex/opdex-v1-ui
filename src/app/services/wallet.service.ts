import { JwtService } from './utility/jwt.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class WalletService {
  private _token: string;

  constructor(private _jwtService: JwtService) { }

  getToken(): string {
    return this._token;
  }

  setToken(token: string): void {
    this._token = token;
    this._jwtService.setToken(token);
  }
}
