import { ThemeService } from './theme.service';
import { UserContextService } from './user-context.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { AuthApiService } from '@sharedServices/api/auth-api.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { StorageService } from './storage.service';
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
    private _storage: StorageService,
    private _env: EnvironmentsService,
    private _authApi: AuthApiService,
    private _platformApi: PlatformApiService,
    private _route: ActivatedRoute,
    private _context: UserContextService,
    private _router: Router,
    private _theme: ThemeService,
  ) { }

  login(): void {
    const state = {
      nonce: this._guid(),
      // Todo: If /login view is used, will need to check and adjust to / or /wallet
      route: window.location.href
    };

    const stateEncoded = btoa(JSON.stringify(state));
    console.log(stateEncoded);

    this._storage.setLocalStorage('auth-state', stateEncoded);

    const authRoute = this._env.getAuthRoute(stateEncoded);

    window.location.href = authRoute;
  }

  async verify(accessCode: string, state: string): Promise<void> {
    const stateEncoded = this._storage.getLocalStorage('auth-state');

    if (stateEncoded !== state) return;

    try {
      const stateDecoded = JSON.parse(atob(stateEncoded));
      const route = new URL(stateDecoded.route);
      const token = await this._authApi.verifyAccessCode(accessCode).toPromise();
      this._context.setToken(token);
      const { preferences } = this._context.getUserContext();
      if (preferences?.theme) this._theme.setTheme(preferences.theme);

      // Todo: Use state route
      // -- include all query params etc
      // this._router.navigateByUrl('/wallet');
    } catch(error) {
      // Todo: Handle error
      return;
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
