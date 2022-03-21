import { ThemeService } from '@sharedServices/utility/theme.service';
import { Component } from '@angular/core';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'opdex-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  constructor(
    private _context: UserContextService,
    private _router: Router,
    private _theme: ThemeService,
    private _activatedRoute: ActivatedRoute
  ) {
    const accessToken = this._activatedRoute.snapshot.queryParamMap.get('ACCESS_TOKEN');

    if (!accessToken) {
      this._router.navigateByUrl('/');
      return;
    }

    this._context.setToken(accessToken);

    const { preferences } = this._context.getUserContext();

    if (preferences?.theme) this._theme.setTheme(preferences.theme);

    this._router.navigateByUrl('/wallet');
  }
}
