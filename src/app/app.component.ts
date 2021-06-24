import { environment } from '@environments/environment';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { SidenavService } from './services/sidenav.service';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from './services/theme.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ISidenavMessage, SidenavView } from '@sharedModels/sidenav-view';
import { Subscription, timer } from 'rxjs';
import { TransactionTypes } from '@sharedLookups/transaction-types.lookup';
import { FadeAnimation } from '@sharedServices/animations/fade-animation';
import { RouterOutlet } from '@angular/router';
import { WalletService } from '@sharedServices/wallet.service';
import { switchMap, take } from 'rxjs/operators';

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
  loading = true;
  subscription = new Subscription();
  transactionTypes = [...TransactionTypes];

  constructor(
    public overlayContainer: OverlayContainer,
    private _theme: ThemeService,
    private _sidenav: SidenavService,
    private _api: PlatformApiService,
    private _wallet: WalletService
  ) {}

  ngOnInit(): void {
    this._api.auth(environment.marketAddress, environment.walletAddress)
      .pipe(take(1))
      .subscribe(token => {
        this._wallet.setToken(token);
        this.loading = false;
      });

    this._theme.getTheme()
      .subscribe(theme => this.setTheme(theme));

    this.listenToSidenav();

    this.subscription.add(
      timer(0, 10000)
        .pipe(switchMap(() => this._api.processLatestBlocks()))
        .subscribe());
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
