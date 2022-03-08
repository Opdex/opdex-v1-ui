import { MaintenanceService } from './services/utility/maintenance.service';
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
import { of, Subscription, timer } from 'rxjs';
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
  updateOpened = false;
  updateAvailable = false;
  menuOpen = false;
  isPinned = true;
  loading = true;
  icons = Icons;
  subscription = new Subscription();

  constructor(
    public overlayContainer: OverlayContainer,
    public dialog: MatDialog,
    public router: Router,
    public gaService: GoogleAnalyticsService,
    private _theme: ThemeService,
    private _sidenav: SidenavService,
    private _context: UserContextService,
    private _title: Title,
    private _indexService: IndexService,
    private _jwt: JwtService,
    private _transactionService: TransactionsService,
    private _cdRef: ChangeDetectorRef,
    private _appUpdate: SwUpdate,
    private _env: EnvironmentsService,
    private _maintenance: MaintenanceService
  ) {
    window.addEventListener('resize', this.appHeight);
    this.appHeight();

    this.configuredForEnv = !!this._env.marketAddress && !!this._env.routerAddress;

    setTimeout(() => this.loading = false, 2000);
  }

  ngAfterContentChecked(): void {
    this._cdRef.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    const storedToken = this._context.getToken();
    this._context.setToken(storedToken);
    this.subscription.add(
      this._context.getUserContext$()
        .subscribe(async context => {
          if (!context?.wallet) this.stopHubConnection();
          else if (!this.hubConnection) await this.connectToSignalR();
        }));

    // Get index status on timer
    this.subscription.add(
      timer(0, 8000)
        .pipe(
          switchMap(_ => this._indexService.refreshStatus$()),
          tap(_ => this.validateJwt()))
        .subscribe(indexStatus => this.indexStatus = indexStatus));

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
      .pipe(
        filter(event => event instanceof NavigationEnd),
        filter(_ => this.updateAvailable))
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

    this.subscription.add(
      this._maintenance.maintenance$
        .subscribe(maintenance => this.maintenance = maintenance));

    if (environment.production) {
      this.subscription.add(
        timer(60000, 60000) // 60 second delay, 60 second interval
          .subscribe(async _ => {
            const updateAvailable = await this._appUpdate.checkForUpdate();
            if (updateAvailable) this.openAppUpdate();
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

  private validateJwt(): void {
    const userIsLoggedIn = !!this._context.getUserContext()?.wallet;
    const tokenIsExpired = this._jwt.isTokenExpired();

    if (userIsLoggedIn && tokenIsExpired) {
      this._context.setToken('');
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
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this._env.apiUrl}/socket`, { accessTokenFactory: () => this._jwt.getToken() })
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

    this.hubConnection.onclose(() => {
      console.log('closing connection')
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
