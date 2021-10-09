import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { environment } from '@environments/environment';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { SidenavService } from './services/utility/sidenav.service';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './services/utility/theme.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ISidenavMessage, TransactionView } from '@sharedModels/transaction-view';
import { Observable, Subscription, timer } from 'rxjs';
import { TransactionTypes } from '@sharedLookups/transaction-types.lookup';
import { FadeAnimation } from '@sharedServices/animations/fade-animation';
import { RouterOutlet } from '@angular/router';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { BugReportModalComponent } from '@sharedComponents/modals-module/bug-report-modal/bug-report-modal.component';
import { Title } from '@angular/platform-browser';

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
  sidenavMode: 'over' | 'side' = 'over';
  theme: string;
  subscription = new Subscription();
  transactionTypes = [...TransactionTypes];
  context$: Observable<any>;
  latestSyncedBlock$: Observable<any>;
  context: any;
  network: string;
  widescreen: boolean;

  constructor(
    public overlayContainer: OverlayContainer,
    public dialog: MatDialog,
    private _theme: ThemeService,
    private _sidenav: SidenavService,
    private _api: PlatformApiService,
    private _context: UserContextService,
    private _breakpointObserver: BreakpointObserver,
    private _title: Title
  ) {
    this.context$ = this._context.getUserContext$().pipe(tap(context => this.context = context));
    this.latestSyncedBlock$ = timer(0,8000).pipe(switchMap(_ => this._api.getLatestSyncedBlock()));
    this.network = environment.network;

    this._breakpointObserver
      .observe(['(max-width: 1919px)'])
      .subscribe((result: BreakpointState) => {
        this.widescreen = !result.matches;
        if (!this.widescreen && this.sidenavMode === 'side') this.toggleSidenavAppearance();
      });
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

  toggleTheme() {
    this._theme.setTheme(this.theme === 'light-mode' ? 'dark-mode' : 'light-mode');
  }

  private setTheme(theme: string): void {
    const overlayClassList = this.overlayContainer.getContainerElement().classList;
    overlayClassList.add(theme);

    if (this.theme) {
      overlayClassList.remove(this.theme);
    }

    this.componentCssClass = `${theme} root`;
    this.theme = theme;

    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    metaThemeColor.setAttribute("content", this.theme === 'light-mode' ? '#ffffff' : '#1b192f');
  }

  setTransactionView(view: TransactionView) {
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
    if (outlet.activatedRouteData.title) {
      this._title.setTitle(outlet.activatedRouteData.title);
    }

    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  menuOpen = false;
  toggleMenu(event: boolean) {
    this.menuOpen = event;
  }

  isPinned = false;
  handlePinnedToggle(event: boolean) {
    this.isPinned = event;
  }

  handleRouteChanged(url: string) {
    // dont care about the url just close the menu
    this.menuOpen = false;
  }

  openBugReport(): void {
    this.dialog.open(BugReportModalComponent, {
      width: '500px'
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
