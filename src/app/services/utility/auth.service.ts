import { AuthVerification } from './../../models/ui/auth-verification';
import { UserContextService } from './user-context.service';
import { AuthApiService } from '@sharedServices/api/auth-api.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { StorageService } from './storage.service';
import { Injectable } from "@angular/core";
import { SHA256 } from "crypto-js";
import { v4 as uuidv4 } from 'uuid';

const AUTH_STATE: string = 'auth-state';
const CODE_VERIFIER: string = 'code-verifier';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
    private _storage: StorageService,
    private _env: EnvironmentsService,
    private _authApi: AuthApiService,
    private _context: UserContextService
  ) { }

  login(): void {
    const codeVerifier = this._encodeBase64Url(uuidv4().replace(/-/g, ''));
    const codeChallenge = this._encodeBase64Url(SHA256(codeVerifier).toString());
    const stateEncoded = this._encodeBase64Url(JSON.stringify({
      nonce: uuidv4().replace(/-/g, ''),
      route: window.location.href.includes('login')
        ? window.location.href.replace('login', 'wallet')
        : window.location.href
    }));

    this._storage.setLocalStorage(AUTH_STATE, stateEncoded);
    this._storage.setLocalStorage(CODE_VERIFIER, codeVerifier);

    window.location.href = this._env.getAuthRoute(stateEncoded, codeChallenge);
  }

  async verify(accessCode: string, state: string): Promise<AuthVerification> {
    if (!accessCode) {
      console.log('Code must be provided');
      return new AuthVerification(false, null);
    }

    const stateEncoded = this._storage.getLocalStorage<string>(AUTH_STATE);
    const codeVerifier = this._storage.getLocalStorage<string>(CODE_VERIFIER);

    if (stateEncoded !== state) {
      console.group(`state encoded: ${stateEncoded} does not match ${state}`);
      return new AuthVerification(false, null);
    }

    try {
      const stateDecoded = JSON.parse(this._decodeBase64Url(stateEncoded));
      const token = await this._authApi.verifyAccessCode(accessCode, codeVerifier).toPromise();

      this._context.setToken(token);
      this._storage.removeLocalStorage(AUTH_STATE);
      this._storage.removeLocalStorage(CODE_VERIFIER);

      return new AuthVerification(true, new URL(stateDecoded.route));
    } catch(error) {
      console.log(error);
      return new AuthVerification(false, null);
    }
  }

  private _encodeBase64Url(value: string): string {
    return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  private _decodeBase64Url(value: string): string {
    return atob(this._padRight(value.replace(/-/g, '+').replace(/_/g, '/')));
  }

  private _padRight(value: string) {
    const amount = value.length + (4 - value.length % 4) % 4;

    if (amount > value.length) {
      for(let i = 0; i < amount - value.length; i++) {
        value += '=';
      }
    }

    return value;
  }
}
