import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { ThemeService } from '@sharedServices/utility/theme.service';
import { Component } from '@angular/core';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Subscription, timer } from 'rxjs';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { JwtService } from '@sharedServices/utility/jwt.service';
import { AuthService } from '@sharedServices/utility/auth.service';

@Component({
  selector: 'opdex-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  subscription = new Subscription();
  error: boolean;
  icons = Icons;
  iconSizes = IconSizes;
  hubConnection: HubConnection;
  stratisId: string;
  expirationTime: number;
  expirationLength: number;
  timeRemaining: string;
  percentageTimeRemaining: number;
  connectionId: string;
  reconnecting: boolean;
  isTestnet: boolean;
  webSid: SafeUrl;
  useNewAuthFlow: boolean;

  constructor(
    private _context: UserContextService,
    private _router: Router,
    private _theme: ThemeService,
    private _activatedRoute: ActivatedRoute,
    private _env: EnvironmentsService,
    private _jwt: JwtService,
    private _sanitizer: DomSanitizer,
    private _authService: AuthService
  ) {
    this.useNewAuthFlow = this._env.useNewAuthFlow
  }

  // ********************************** //
  //        LEGACY FLOW                 //
  // ********************************** //
  async ngOnInit() {
    if (!this.useNewAuthFlow) {
      this.subscription.add(
        this._context.getUserContext$()
          .subscribe(async context => {
            if (context?.wallet) {
              if (context.preferences?.theme) {
                this._theme.setTheme(context.preferences.theme);
              }

              this._router.navigateByUrl('/');
            } else if (!this.hubConnection) {
              await this.connectToSignalR();
            }
          }));

      this.subscription.add(timer(0, 1000).subscribe(async _ => await this.calcSidExpiration()));
    } else {
      const accessCode = this._activatedRoute.snapshot.queryParamMap.get('code');
      const state = this._activatedRoute.snapshot.queryParamMap.get('state');

      if (!accessCode || !state) {
        this._router.navigateByUrl('/');
        return;
      }

      await this._authService.verify(accessCode, state);
    }
  }

  private async connectToSignalR(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this._env.platformApiUrl}/socket`, { accessTokenFactory: () => this._jwt.getToken() })
      .configureLogging(LogLevel.Error)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onclose(_ => console.log('closing connection'));

    await this.hubConnection.start();
    await this.getStratisId();

    this.hubConnection.onreconnecting(_ => this.reconnecting = true);
    this.hubConnection.onreconnected(async (connectionId: string) => await this._onReconnected(connectionId));
    this.hubConnection.on('OnAuthenticated', async (token: string) => await this._onAuthenticated(token));
  }

  private async _onReconnected(newConnectionId: string): Promise<void> {
    if (newConnectionId !== this.connectionId) {
      try {
        const success = await this.hubConnection.invoke('Reconnect', this.connectionId, this.stratisId);
        if (!success) await this.getStratisId();
      } catch (error) {
        await this.getStratisId();
      }
    }

    this.reconnecting = false;
  }

  private async _onAuthenticated(token: string): Promise<void> {
    // Set timeout to allow all promises to finished before closing the connection
    // Specifically during _onReconnected, wait to finish reconnecting
    setTimeout(async _ => {
      await this.stopHubConnection();
      this._context.setToken(token);
    });
  }

  private async getStratisId(): Promise<void> {
    this.connectionId = this.hubConnection.connectionId;
    this.stratisId = await this.hubConnection.invoke('GetStratisId');

    if (!!this.stratisId === false || !this.stratisId.startsWith('sid:')) return;

    const url = new URL(this.stratisId.replace('sid:', 'https://'));
    const expiration = parseInt(url.searchParams.get('exp'));

    this.webSid = this._sanitizer.bypassSecurityTrustUrl(this.stratisId.replace('sid:', 'web+sid://'));
    this.expirationTime = new Date(expiration * 1000).getTime();
    this.expirationLength = (this.expirationTime - new Date().getTime()) / 1000;

    await this.calcSidExpiration();
  }

  private async calcSidExpiration(): Promise<void> {
    const timeRemaining = (this.expirationTime - new Date().getTime()) / 1000;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = Math.floor(timeRemaining % 60);

    if (minutes <= 0 && seconds <= 0) await this.getStratisId();

    this.percentageTimeRemaining = Math.floor((timeRemaining  / this.expirationLength) * 100);
    this.timeRemaining = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private async stopHubConnection(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
  }

  async ngOnDestroy() {
    this.subscription.unsubscribe();
    await this.stopHubConnection();
  }
}
