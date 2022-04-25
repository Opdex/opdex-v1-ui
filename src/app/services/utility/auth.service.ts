import { AuthVerification } from '@sharedModels/ui/auth-verification';
import { UserContextService } from './user-context.service';
import { AuthApiService } from '@sharedServices/api/auth-api.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { StorageService } from './storage.service';
import { Injectable } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';
import pkceChallenge from "pkce-challenge";
import { encode, decode } from 'url-safe-base64'


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
    const challenge = pkceChallenge();
    const stateEncoded = btoa(encode(JSON.stringify({
      nonce: uuidv4().replace(/-/g, ''),
      route: window.location.href.replace('login', 'wallet')
    })));

    this._storage.setLocalStorage(AUTH_STATE, stateEncoded);
    this._storage.setLocalStorage(CODE_VERIFIER, challenge.code_verifier);

    window.location.href = this._env.getAuthRoute(stateEncoded, challenge.code_challenge);
  }

  async verify(accessCode: string, state: string): Promise<AuthVerification> {
    if (!accessCode) return new AuthVerification({error: 'Code must be provided!'});

    const stateEncoded = this._storage.getLocalStorage<string>(AUTH_STATE);
    const codeVerifier = this._storage.getLocalStorage<string>(CODE_VERIFIER);

    if (stateEncoded !== state) return new AuthVerification({error: `Invalid state!`});

    try {
      const token = await this._authApi.verifyAccessCode(accessCode, codeVerifier).toPromise();

      this._context.setToken(token);
      this._storage.removeLocalStorage(AUTH_STATE);
      this._storage.removeLocalStorage(CODE_VERIFIER);

      return new AuthVerification({route: new URL(JSON.parse(atob(decode(stateEncoded))).route)});
    } catch(error) {
      return new AuthVerification({error});
    }
  }
}
