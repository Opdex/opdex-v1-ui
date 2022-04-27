import { ThemeService } from '@sharedServices/utility/theme.service';
import { Component } from '@angular/core';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { AuthService } from '@sharedServices/utility/auth.service';

@Component({
  selector: 'opdex-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  authFailure: boolean;
  icons = Icons;
  iconSizes = IconSizes;

  constructor(
    private _userContextService: UserContextService,
    private _router: Router,
    private _theme: ThemeService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService
  ) { }

  async ngOnInit() {
    const currentContext = this._userContextService.userContext;

    if (currentContext.wallet) {
      this._router.navigateByUrl('/');
      return;
    }

    const accessCode = this._activatedRoute.snapshot.queryParamMap.get('code');
    const state = this._activatedRoute.snapshot.queryParamMap.get('state');
    const verification = await this._authService.verifyLogin(accessCode, state);

    this.authFailure = !verification.success;

    if (verification.success) {
      const { preferences } = this._userContextService.userContext;
      if (preferences?.theme) this._theme.setTheme(preferences.theme);

      this._router.navigate([verification.routePath], verification.routeQueryParams);
    }
  }

  login(): void {
    this._authService.prepareLogin();
  }
}
