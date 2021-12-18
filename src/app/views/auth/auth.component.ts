import { ThemeService } from '@sharedServices/utility/theme.service';
import { StorageService } from '@sharedServices/utility/storage.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, catchError, startWith, map } from 'rxjs/operators';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Router } from '@angular/router';
import { Observable, of, Subscription, timer } from 'rxjs';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Network } from 'src/app/enums/networks';
import { JwtService } from '@sharedServices/utility/jwt.service';

@Component({
  selector: 'opdex-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  private _storageKey = 'devnet-public-keys';
  devnetPublicKeys: string[];
  devnetPublicKeys$: Observable<string[]>;
  isDevnet: boolean;
  form: FormGroup;
  submitting: boolean;
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

  get publicKey(): FormControl {
    return this.form.get('publicKey') as FormControl;
  }

  get rememberMe(): FormControl {
    return this.form.get('rememberMe') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _api: PlatformApiService,
    private _context: UserContextService,
    private _router: Router,
    private _storage: StorageService,
    private _theme: ThemeService,
    private _env: EnvironmentsService,
    private _jwt: JwtService
  ) {
    this.isDevnet = this._env.network === Network.Devnet;
    this.form = this._fb.group({
      publicKey: ['', [Validators.required, Validators.minLength(32), Validators.maxLength(36)]],
      rememberMe: [false]
    });

    this.devnetPublicKeys = this._storage.getLocalStorage(this._storageKey, true) || [];
    this.devnetPublicKeys$ = this.publicKey.valueChanges
      .pipe(
        startWith(''),
        map(key => key ? this._filterDevnetPublicKeys(key) : this.devnetPublicKeys.slice()));
  }

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

  submitDevnetAuth(): void {
    this.submitting = true;
    this.error = false;
    const publicKey = this.publicKey.value; // Make copy, prevents changes during loading

    // Todo: Sign Message / POST to /auth w/ signature and pub key
    this._api.auth(publicKey)
      .pipe(take(1))
      .pipe(catchError(() => {
        this.error = true;
        return of(null);
      }))
      .subscribe((token: string) => {
        if (token !== null) {
          if (this.rememberMe.value === true && this.devnetPublicKeys.indexOf(publicKey) < 0) {
            this.devnetPublicKeys.push(publicKey);
            this._storage.setLocalStorage(this._storageKey, this.devnetPublicKeys, true);
          }

          this._context.setToken(token);
          this.error = false;
        }

        this.submitting = false;
      });
  }

  deleteDevnetPublicKey(key: string) {
    const updatedKeys = this.devnetPublicKeys.filter(publicKey => publicKey !== key);
    this._storage.setLocalStorage(this._storageKey, updatedKeys, true);
    this.devnetPublicKeys = updatedKeys;
    // Set timeout to clear the input after the option is selected.
    // Delete button is within a select option, so that action also gets triggered
    setTimeout(() => this.publicKey.setValue(''));
  }

  private _filterDevnetPublicKeys(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.devnetPublicKeys.filter(key => key.toLowerCase().includes(filterValue));
  }

  private async connectToSignalR(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this._env.apiUrl}/socket`,  { accessTokenFactory: () => this._jwt.getToken() })
      .configureLogging(LogLevel.Error)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onclose(_ => console.log('closing connection'));

    await this.hubConnection.start();

    await this.getStratisId();

    this.hubConnection.on('OnAuthenticated', async (token: string) => {
      await this.stopHubConnection();
      this._context.setToken(token);
    });
  }

  private async getStratisId() {
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
