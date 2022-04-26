import { catchError } from 'rxjs/operators';
import { IAuthResponse } from '@sharedModels/auth-api/auth-response.interface';
import { JwtService } from '@sharedServices/utility/jwt.service';
import { AuthRequest } from '@sharedModels/auth-api/auth-request';
import { AuthVerification } from '@sharedModels/ui/auth-verification';
import { UserContextService } from './user-context.service';
import { AuthApiService } from '@sharedServices/api/auth-api.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { StorageService } from './storage.service';
import { Injectable } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';
import pkceChallenge from "pkce-challenge";
import { encode, decode } from 'url-safe-base64'
import { lastValueFrom, Observable, of, tap } from 'rxjs';


const AUTH_STATE: string = 'auth-state';
const CODE_VERIFIER: string = 'code-verifier';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
    private _storage: StorageService,
    private _env: EnvironmentsService,
    private _authApi: AuthApiService,
    private _context: UserContextService,
    private _jwt: JwtService
  ) { }

  prepareLogin(): void {
    const challenge = pkceChallenge();
    const stateEncoded = window.btoa(encode(JSON.stringify({
      nonce: uuidv4().replace(/-/g, ''),
      route: window.location.href.replace('login', 'wallet')
    })));

    this._storage.setLocalStorage(AUTH_STATE, stateEncoded);
    this._storage.setLocalStorage(CODE_VERIFIER, challenge.code_verifier);

    window.location.href = this._env.getAuthRoute(stateEncoded, challenge.code_challenge);
  }

  async verifyLogin(accessCode: string, state: string): Promise<AuthVerification> {
    if (!accessCode) return new AuthVerification({error: 'Code must be provided!'});

    const stateEncoded = this._storage.getLocalStorage<string>(AUTH_STATE);
    this._storage.removeLocalStorage(AUTH_STATE);

    const codeVerifier = this._storage.getLocalStorage<string>(CODE_VERIFIER);
    this._storage.removeLocalStorage(CODE_VERIFIER);

    if (stateEncoded !== state) return new AuthVerification({error: `Invalid state!`});

    try {
      const request = new AuthRequest(accessCode, codeVerifier);
      const response = await lastValueFrom(this._authApi.auth(request));

      this._context.set(response);

      return new AuthVerification({route: new URL(JSON.parse(window.atob(decode(stateEncoded))).route)});
    } catch(error) {
      return new AuthVerification({error});
    }
  }

  refresh(): Observable<IAuthResponse> {
    const { refreshToken } = this._jwt;

    if (!refreshToken) return of(undefined);

    const request = new AuthRequest(null, null, refreshToken);

    return this._authApi.auth(request)
      .pipe(
        tap(response => this._context.set(response)),
        catchError(_ => of(undefined)));
  }
}
