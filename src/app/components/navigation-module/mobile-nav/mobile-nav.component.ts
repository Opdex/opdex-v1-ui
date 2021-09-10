import { Component, OnDestroy } from '@angular/core';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'opdex-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent implements OnDestroy {
  userContext$: Observable<any>;
  theme$: Subscription;
  theme: 'light-mode' | 'dark-mode';

  constructor(private _context: UserContextService, private _theme: ThemeService) {
    this.userContext$ = this._context.getUserContext$();
    this.theme$ = this._theme.getTheme().subscribe((theme: 'light-mode' | 'dark-mode') => this.theme = theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    this._theme.setTheme(this.theme);
  }

  ngOnDestroy() {
    if (this.theme$) this.theme$.unsubscribe();
  }
}
