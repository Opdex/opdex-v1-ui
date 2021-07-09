import { environment } from '@environments/environment';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { SidenavService } from './services/sidenav.service';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './services/theme.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ISidenavMessage, SidenavView } from '@sharedModels/sidenav-view';
import { Observable, Subscription, timer } from 'rxjs';
import { TransactionTypes } from '@sharedLookups/transaction-types.lookup';
import { FadeAnimation } from '@sharedServices/animations/fade-animation';
import { RouterOutlet } from '@angular/router';
import { UserContextService } from '@sharedServices/user-context.service';
import { skip, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [FadeAnimation]
})
export class AppComponent implements OnInit {
  @HostBinding('class') componentCssClass: string;
  @ViewChild('sidenav') sidenav: MatSidenav;
  message: ISidenavMessage;
  sidenavMode: 'over' | 'side' = 'side';
  theme: string;
  subscription = new Subscription();
  transactionTypes = [...TransactionTypes];
  context$: Observable<any>;
  context: any;

  constructor(
    public overlayContainer: OverlayContainer,
    private _theme: ThemeService,
    private _sidenav: SidenavService,
    private _api: PlatformApiService,
    private _context: UserContextService
  ) {
    this.context$ = this._context.getUserContext$();
  }

  ngOnInit(): void {
    this.context = this._context.getUserContext();

    this.subscription.add(
      this._api.auth(environment.marketAddress, this.context?.wallet)
        .subscribe(jwt => this._context.setToken(jwt)));

    this._theme.getTheme().subscribe(theme => this.setTheme(theme));

    this.listenToSidenav();
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
    const existingData = this.message.data;
    this.message = {
      view: view,
      data: existingData,
      status: true
    }
  }

  closeSidenav() {
    this._sidenav.closeSidenav();
  }

  toggleSidenavAppearance() {
    this.sidenavMode = this.sidenavMode == 'over' ? 'side' : 'over';
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
