import { ThemeService } from './theme.service';
import { UserContextService } from './user-context.service';
import { Router } from '@angular/router';
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
    private _context: UserContextService,
    private _router: Router,
    private _theme: ThemeService
  ) { }

  login(): void {
    const codeVerifier = uuidv4();
    const codeChallenge = btoa(SHA256(codeVerifier).toString());
    const stateEncoded = btoa(JSON.stringify({
      nonce: this._guid(),
      route: window.location.href.includes('login')
        ? window.location.href.replace('login', 'wallet')
        : window.location.href
    }));

    this._storage.setLocalStorage(AUTH_STATE, stateEncoded);
    this._storage.setLocalStorage(CODE_VERIFIER, codeVerifier);

    window.location.href = this._env.getAuthRoute(stateEncoded, codeChallenge);
  }

  async verify(accessCode: string, state: string): Promise<void> {
    const stateEncoded = this._storage.getLocalStorage<string>(AUTH_STATE);
    const codeVerifier = this._storage.getLocalStorage<string>(CODE_VERIFIER);

    if (stateEncoded !== state) {
      console.log('invalid state');
      console.group(`state encoded: ${stateEncoded} does not match ${state}`);
      return;
    }

    try {
      // Verify Token
      const stateDecoded = JSON.parse(atob(stateEncoded));
      const token = await this._authApi.verifyAccessCode(accessCode, codeVerifier).toPromise();
      this._context.setToken(token);

      // Clear Storage
      this._storage.removeLocalStorage(AUTH_STATE);
      this._storage.removeLocalStorage(CODE_VERIFIER);

      // Set Theme
      const { preferences } = this._context.getUserContext();
      if (preferences?.theme) this._theme.setTheme(preferences.theme);

      // Build and Route
      let queryParams = {};
      const { searchParams, pathname } = new URL(stateDecoded.route);
      searchParams.forEach((value: string, key: string) => queryParams[key] = value);
      this._router.navigate([pathname], {queryParams});
    } catch(error) {
      console.log(error);
      console.log('thrown error')
      return; // Todo: Handle error
    }
  }

  private _guid(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }
}
