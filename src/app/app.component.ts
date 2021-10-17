import { TransactionReceipt } from './models/transaction-receipt';
import { ITransactionReceipt } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { catchError, take } from 'rxjs/operators';
import { TransactionsService } from '@sharedServices/platform/transactions.service';
import { NotificationService } from './services/utility/notification.service';
import { JwtService } from '@sharedServices/utility/jwt.service';
import { environment } from '@environments/environment';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { SidenavService } from './services/utility/sidenav.service';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './services/utility/theme.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, of, Subscription, timer } from 'rxjs';
import { FadeAnimation } from '@sharedServices/animations/fade-animation';
import { Router, RouterOutlet, RoutesRecognized } from '@angular/router';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { filter, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { BugReportModalComponent } from '@sharedComponents/modals-module/bug-report-modal/bug-report-modal.component';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { ISidenavMessage } from '@sharedModels/transaction-view';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

@Component({
  selector: 'opdex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [FadeAnimation]
})
export class AppComponent implements OnInit {
  @HostBinding('class') componentCssClass: string;
  @ViewChild('sidenav') sidenav: MatSidenav;
  theme: string;
  subscription = new Subscription();
  context$: Observable<any>;
  context: any;
  network: string;
  menuOpen = false;
  isPinned = false;
  message: ISidenavMessage;
  sidenavMode: 'over' | 'side' = 'over';
  hubConnection: HubConnection;

  constructor(
    public overlayContainer: OverlayContainer,
    public dialog: MatDialog,
    public router: Router,
    public gaService: GoogleAnalyticsService,
    private _theme: ThemeService,
    private _sidenav: SidenavService,
    private _api: PlatformApiService,
    private _context: UserContextService,
    private _title: Title,
    private _blocksService: BlocksService,
    private _jwt: JwtService,
    private _notificationService: NotificationService,
    private _transactionService: TransactionsService
  ) {
    this.network = environment.network;
    this.context = this._context.getUserContext();
    this.subscription.add(
      this._api.auth(environment.marketAddress, this.context?.wallet)
        .subscribe(jwt => this._context.setToken(jwt)));
  }

  ngOnInit(): void {
    // Get context
    this.subscription
      .add(this._context.getUserContext$()
      .subscribe(async context => {
        this.context = context;

        if (this.hubConnection && !this.context?.wallet) {
          this.hubConnection.stop();
        }

        if (!this.hubConnection && this.context?.wallet) {
          await this.connectToSignalR();
        }
      }));

    // Refresh blocks on timer
    this.subscription.add(timer(0,8000).subscribe(_ => this._blocksService.refreshLatestBlock()));

    // Get theme
    this.subscription.add(this._theme.getTheme().subscribe(theme => this.setTheme(theme)));

    // Watch router events
    this.subscription.add(
      this.router.events
      .pipe(
        filter(event => event instanceof RoutesRecognized),
        map((event: RoutesRecognized) => {return {path: event.url, title: event.state.root.firstChild.data['title']}}),
        filter(route => route.title),
        tap(route => this._title.setTitle(route.title)),
        tap(route => this.gaService.pageView(route.path, route.title)))
      .subscribe());

    // Listen to tx sidenav events
    this.subscription.add(
      this._sidenav.getStatus()
        .subscribe(async (message: ISidenavMessage) => {
          this.message = message;
          if (message.status === true) await this.sidenav.open()
          else await this.sidenav.close();
        }));
  }

  notify() {
    this._notificationService.pushBroadcastTransactionNotification("76993278130b9071ab23a612003d6818c7b0a14f54ba80936c99ca77148068a1");
  }

  toggleTheme() {
    this._theme.setTheme(this.theme === 'light-mode' ? 'dark-mode' : 'light-mode');
  }

  private setTheme(theme: string): void {
    if (theme === this.theme) return;

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

  handleSidenavModeChange(event: 'over' | 'side') {
    this.sidenavMode = event;
  }

  closeSidenav() {
    this._sidenav.closeSidenav();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  toggleMobileMenu(event: boolean) {
    this.menuOpen = event;
  }

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

  private async connectToSignalR(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/transactions/socket`, {
        accessTokenFactory: () => this._jwt.getToken()
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('OnTransactionMined', async (txHash: string) => {

      this._transactionService.getTransaction(txHash)
        .pipe(
          catchError(_ => of(null)),
          filter(value => value !== null),
          map((transaction: ITransactionReceipt) => new TransactionReceipt(transaction)),
          take(1))
        .subscribe(transaction => {
          // Push the UI notification to the user
          this._notificationService.pushMinedTransactionNotification(transaction);

          // Todo: Should probably also update an observable for observers
        });
    });

    this.hubConnection.on('OnTransactionBroadcast', async (txHash: string) => {
      // Push the UI notification to the user
      this._notificationService.pushBroadcastTransactionNotification(txHash);

      // Todo: Should probably also update an observable for the tx sidebar to act on.
    });

    this.hubConnection.onclose(() => {
      console.log('closing connection')
    });

    await this.hubConnection.start();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
