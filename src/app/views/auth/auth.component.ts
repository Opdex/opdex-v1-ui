import { ThemeService } from '@sharedServices/utility/theme.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { JwtService } from '@sharedServices/utility/jwt.service';

@Component({
  selector: 'opdex-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
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

  constructor(
    private _context: UserContextService,
    private _router: Router,
    private _theme: ThemeService,
    private _env: EnvironmentsService,
    private _jwt: JwtService
  ) { }

  async ngOnInit() {
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
  }

  private async connectToSignalR(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this._env.apiUrl}/socket`, { accessTokenFactory: () => this._jwt.getToken() })
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
