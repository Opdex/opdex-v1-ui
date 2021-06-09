import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { SidenavService } from './services/sidenav.service';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './services/theme.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ISidenavMessage, SidenavView } from '@sharedModels/sidenav-view';
import { Subscription } from 'rxjs';

@Component({
  selector: 'opdex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('class') componentCssClass: string;
  @ViewChild('sidenav') sidenav: MatSidenav;
  message: ISidenavMessage;
  sidenavMode: 'over' | 'side' = 'over';
  theme: string;
  loading = true;
  subscription = new Subscription();


  constructor(
    public overlayContainer: OverlayContainer,
    private _theme: ThemeService,
    private _sidenav: SidenavService,
    private _api: PlatformApiService
  ) {}

  async ngOnInit(): Promise<void> {
    await this._api.auth('asdf', 'asdf');

    this._theme.getTheme()
      .subscribe(theme => this.setTheme(theme));

      this.listenToSidenav();

      this.loading = false;
  }

  private listenToSidenav(): void {
    this.subscription.add(
      this._sidenav.getStatus()
        .subscribe(async (message: ISidenavMessage) => {
          this.message = message;
          if (message.status === true) await this.sidenav.open()
          else await this.sidenav.close();
        }));
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

  setSidenavView(view: SidenavView) {
    this.message = {
      view: view,
      data: null,
      status: true
    }
  }

  closeSidenav() {
    this._sidenav.closeSidenav();
  }

  toggleSidenavAppearance() {
    this.sidenavMode = this.sidenavMode == 'over' ? 'side' : 'over';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
