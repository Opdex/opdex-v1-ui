import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { IToken } from '@sharedModels/responses/platform-api/token.interface';

@Injectable({providedIn: 'root'})
export class TokenCache {
  private cache: Record<string, BehaviorSubject<IToken>> = {};

  constructor() { }

  getToken(address: string): Observable<IToken> {
    if (!this.cache[address]) {
      this.setToken({address} as IToken);
    }

    return this.cache[address];
  }

  setToken(token: IToken): void {
    if (this.cache[token.address]) {
      this.cache[token.address].next(token);
    } else {
      this.cache[token.address] = new BehaviorSubject(token);
    }
  }
}
