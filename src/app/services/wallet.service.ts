import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class WalletService {
  private _token: string;

  getToken(): string {
    return this._token;
  }

  setToken(token: string): void {
    this._token = token;
  }
}
