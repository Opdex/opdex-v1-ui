import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'opdex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('class') componentCssClass: string;
  theme: string;

  constructor(
    public overlayContainer: OverlayContainer,
    private _theme: ThemeService)
  {
    // Initialize all variables or turn off strict mode...
    this.componentCssClass = "";
    this.theme = "";
  }

  async ngOnInit() {
    this._theme.getTheme()
      .subscribe(theme => this.setTheme(theme));
  }

  toggleTheme(): void {
    this.setTheme(this.theme === 'light-mode' ? 'dark-mode' : 'light-mode');
  }

  private setTheme(theme: string): void {
    const overlayClassList = this.overlayContainer.getContainerElement().classList;
    overlayClassList.add(theme);

    if (this.theme) {
      overlayClassList.remove(this.theme);
    }

    this.componentCssClass = `${theme} root`;
    this.theme = theme;
  }
}
