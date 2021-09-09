import { take } from 'rxjs/operators';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
  userContext$: Observable<any>;
  theme: 'light-mode' | 'dark-mode';

  constructor(private _context: UserContextService, private _theme: ThemeService) {
    this.userContext$ = this._context.getUserContext$();
    this._theme.getTheme().pipe(take(1)).subscribe((theme: 'light-mode' | 'dark-mode') => this.theme = theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'light-mode' ? 'dark-mode' : 'light-mode';

    this._theme.setTheme(this.theme);
  }
}
