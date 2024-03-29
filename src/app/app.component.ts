import { WorldTimeApiService } from './services/api/world-time-api.service';
import { StorageService } from './services/utility/storage.service';
import { AuthService } from '@sharedServices/utility/auth.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { environment } from '@environments/environment';
import { IIndexStatus } from './models/platform-api/responses/index/index-status.interface';
import { AppUpdateModalComponent } from './components/modals-module/app-update-modal/app-update-modal.component';
import { TransactionReceipt } from './models/ui/transactions/transaction-receipt';
import { ITransactionReceipt } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { catchError, switchMap, take } from 'rxjs/operators';
import { TransactionsService } from '@sharedServices/platform/transactions.service';
import { JwtService } from '@sharedServices/utility/jwt.service';
import { SidenavService } from './services/utility/sidenav.service';
import { AfterContentChecked, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './services/utility/theme.service';
import { MatSidenav } from '@angular/material/sidenav';
import { firstValueFrom, lastValueFrom, of, Subscription, timer } from 'rxjs';
import { FadeAnimation } from '@sharedServices/animations/fade-animation';
import { Router, RouterOutlet, RoutesRecognized, NavigationEnd } from '@angular/router';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { filter, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { IndexService } from '@sharedServices/platform/index.service';
import { ISidenavMessage } from '@sharedModels/transaction-view';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Icons } from './enums/icons';
import { SwUpdate } from '@angular/service-worker';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { UserContext } from '@sharedModels/user-context';

@Component({
  selector: 'opdex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [FadeAnimation]
})
export class AppComponent implements OnInit, AfterContentChecked, OnDestroy {
  @HostBinding('class') componentCssClass: string;
  @ViewChild('sidenav') sidenav: MatSidenav;
  private appHeightRecorded: number;
  theme: string;
  context: UserContext;
  network: string;
  message: ISidenavMessage;
  sidenavMode: 'over' | 'side' = 'over';
  hubConnection: HubConnection;
  indexStatus: IIndexStatus;
  configuredForEnv: boolean;
  maintenance: boolean;
  hiddenDesktopMessage: boolean;
  updateOpened = false;
  updateAvailable = false;
  menuOpen = false;
  isPinned = true;
  initLoad = true;
  icons = Icons;
  subscription = new Subscription();
  isExpired = false;

  constructor(
    public overlayContainer: OverlayContainer,
    public dialog: MatDialog,
    public router: Router,
    public gaService: GoogleAnalyticsService,
    private _theme: ThemeService,
    private _sidenav: SidenavService,
    private _userContextService: UserContextService,
    private _title: Title,
    private _indexService: IndexService,
    private _jwt: JwtService,
    private _transactionService: TransactionsService,
    private _cdRef: ChangeDetectorRef,
    private _appUpdate: SwUpdate,
    private _env: EnvironmentsService,
    private _platformApiService: PlatformApiService,
    private _authService: AuthService,
    private _storageService: StorageService,
    private _worldTimeService: WorldTimeApiService
  ) {
    window.addEventListener('resize', this.appHeight);
    this.appHeight();
    this.network = this._env.network;
    this.configuredForEnv = !!this._env.marketAddress && !!this._env.routerAddress;
    setTimeout(() => this.initLoad = false, 2000);
  }

  public get loading(): boolean {
    return this.isExpired || this.initLoad;
  }

  ngAfterContentChecked(): void {
    this._cdRef.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    this._checkHiddenDesktopMessage();

    await this._checkWorldTime();

    // TODO: On new session, using the refresh token doesn't allow opening up to guarded pages
    // (i.e. close session, open up at /wallets will redirect to / then refresh the token)
    this.subscription.add(
      this._userContextService.context$
        .pipe(filter(_ => !this.isExpired))
        .subscribe(async context => {
          this.context = context;

          if (!context.wallet) {
            const auth = await lastValueFrom(this._authService.refresh());
            if (!auth) await this.stopHubConnection();
          } else if (!this.hubConnection) {
            await this.connectToSignalR();
          }
        }));

    // Get index status on timer
    this.subscription.add(
      timer(0, 8000)
        .pipe(
          filter(_ => !this.isExpired),
          switchMap(_ => this._indexService.refreshStatus$()),
          filter(indexStatus => indexStatus.latestBlock.height > 0),
          tap(indexStatus => this.indexStatus = indexStatus),
          switchMap(_ => this._platformApiService.getApiStatus()))
        .subscribe(async ({underMaintenance}) => {
          this.maintenance = underMaintenance;
          await this._validateJwt();
        }));

    // Get theme
    this.subscription.add(this._theme.getTheme().subscribe(theme => this.setTheme(theme)));

    // Watch router events for page titles
    this.subscription.add(
      this.router.events
      .pipe(
        filter(event => event instanceof RoutesRecognized),
        map((event: RoutesRecognized) => {return {path: event.url, title: event.state.root.firstChild.data['title']}}),
        filter(route => route.title),
        tap(route => this._title.setTitle(route.title)),
        tap(route => this.gaService.pageView(route.path, route.title)))
      .subscribe());

    // Watch router events for app updates
    this.subscription.add(
      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd && this.updateAvailable))
      .subscribe(_ => this.update()));

    // Listen to tx sidenav events
    this.subscription.add(
      this._sidenav.getStatus()
        .pipe(filter(_ => !!this.sidenav))
        .subscribe(async (message: ISidenavMessage) => {
          this.message = message;
          if (message.status === true) await this.sidenav.open()
          else await this.sidenav.close();
        }));

    if (environment.production) {
      this.subscription.add(
        timer(60000, 60000) // 60 second delay, 60 second interval
          .subscribe(async _ => {
            const updateAvailable = await this._appUpdate.checkForUpdate();
            if (updateAvailable) this.openAppUpdate();

            await this._checkWorldTime();
          }));
    }
  }

  update(): void {
    location.reload();
  }

  handleSidenavModeChange(event: 'over' | 'side'): void {
    this.sidenavMode = event;
  }

  closeSidenav(): void {
    this._sidenav.closeSidenav();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  handleToggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  handlePinnedToggle(event: boolean): void {
    this.isPinned = event;
  }

  handleRouteChanged(url: string): void {
    // dont care about the url just close the menu
    this.menuOpen = false;
  }

  hideDesktopMessage(): void {
    this.hiddenDesktopMessage = true;
    this._storageService.setLocalStorage('desktop-notification', { hidden: true, dateHidden: new Date()}, true);
  }

  private _checkHiddenDesktopMessage(): void {
    const data = this._storageService.getLocalStorage<{hidden: boolean, dateHidden: Date}>('desktop-notification', true);

    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    // If the date it was hidden was over a week ago, show the message again
    if (!!data === false || (!!data && data.hidden && new Date(data.dateHidden) < weekAgo)) {
      this.hiddenDesktopMessage = false;
      this._storageService.setLocalStorage('desktop-notification', { hidden: false, dateHidden: new Date()}, true);
    } else {
      this.hiddenDesktopMessage = data?.hidden || false;
    }
  }

  private async _checkWorldTime(): Promise<void> {
    if (this.isExpired) return;

    const timeResponse = await firstValueFrom(this._worldTimeService.getTime()
      .pipe(catchError(_ => of(null))));

    if (timeResponse !== null) {
      // 12-20-2022 16:00:00 UTC
      const cutoff = Date.UTC(2022, 11, 20, 16);
      const cutoffUnix = cutoff / 1000;

      this.isExpired = cutoffUnix <= timeResponse.unixtime;
    }
  }

  private async _validateJwt(): Promise<void> {
    const userIsLoggedIn = !!this._userContextService.userContext.wallet;
    const { isExpired } = this._jwt;

    if (userIsLoggedIn && isExpired) {
      await lastValueFrom(this._authService.refresh());
    }
  }

  private openAppUpdate(): void {
    if (!this.updateOpened) {
      this.updateOpened = true;
      this.dialog.open(AppUpdateModalComponent, { width: '500px' })
        .afterClosed()
        .pipe(take(1))
        .subscribe(_ => {
          this.updateOpened = false;
          this.updateAvailable = true;
        });
    }
  }

  private setTheme(theme: string): void {
    if (theme === this.theme) return;

    const overlayClassList = this.overlayContainer.getContainerElement().classList;
    overlayClassList.add(theme);
    overlayClassList.remove(this.theme);

    document.documentElement.classList.add(theme);
    document.documentElement.classList.remove(this.theme);

    this.componentCssClass = `${theme} root`;
    this.theme = theme;

    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    metaThemeColor.setAttribute("content", this.theme === 'light-mode' ? '#ffffff' : '#1b192f');
  }

  private async connectToSignalR(): Promise<void> {
    console.log('connecting to signalr')
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this._env.platformApiUrl}/socket`, { accessTokenFactory: () => this._jwt.accessToken })
      .configureLogging(LogLevel.Warning)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('OnTransactionMined', (txHash: string) => {
      this._transactionService.getTransaction(txHash)
        .pipe(
          catchError(_ => of(null)),
          filter(value => value !== null),
          map((transaction: ITransactionReceipt) => new TransactionReceipt(transaction)),
          take(1))
        .subscribe(transaction => {
          this._transactionService.pushMinedTransaction(transaction);
        });
    });

    this.hubConnection.on('OnTransactionBroadcast', (txHash: string) => {
      this._transactionService.pushBroadcastedTransaction(txHash);
    });

    this.hubConnection.onclose(async () => {
      console.log('closing connection');
      if (this.context?.wallet && !this._jwt.isExpired) {
        await this.hubConnection.start();
      }
    });

    await this.hubConnection.start();
  }

  private async stopHubConnection(): Promise<void> {
    if (this.hubConnection && this.hubConnection.connectionId) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
  }

  private appHeight(): void {
    const height = window.innerHeight;

    if (height !== this.appHeightRecorded) {
      this.appHeightRecorded = height;
      document.documentElement.style.setProperty('--app-height', `${height}px`);
    }
  }

  async ngOnDestroy(): Promise<void> {
    this.subscription.unsubscribe();
    await this.stopHubConnection();
  }
}
