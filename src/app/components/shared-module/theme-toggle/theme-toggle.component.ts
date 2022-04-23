import { UserContext, UserContextPreferences } from '@sharedModels/user-context';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnDestroy {
  wallet: UserContext;
  theme: string;
  icons = Icons;
  subscription = new Subscription();

  public get themeName(): string {
    return this.theme.replace('-', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  }

  constructor(
    private _context: UserContextService,
    private _theme: ThemeService,
  ) {
    this.subscription.add(this._context.userContext$.subscribe(context => this.wallet = context));
    this.subscription.add(
      this._theme.getTheme()
        .subscribe(theme => {
          if (theme !== this.theme) {
            this.theme = theme;
            this._setThemePreference(theme);
          }
        }));
  }

  toggleTheme(): void {
    const theme = this.theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    this._setThemePreference(theme);
    this._theme.setTheme(theme);
  }

  private _setThemePreference(theme: string) {
    if (this.wallet) {
      let { wallet, preferences } = this.wallet;
      if (wallet) {
        if (!preferences) preferences = new UserContextPreferences();

        preferences.theme = theme;
        this._context.setUserPreferences(wallet, preferences);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
