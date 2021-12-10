import { ThemeService } from '@sharedServices/utility/theme.service';
import { StorageService } from '@sharedServices/utility/storage.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, catchError, startWith, map } from 'rxjs/operators';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { Network } from 'src/app/enums/networks';
import { JwtService } from '@sharedServices/utility/jwt.service';

@Component({
  selector: 'opdex-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  form: FormGroup;
  submitting: boolean;
  subscription = new Subscription();
  error: boolean;
  publicKeys: string[];
  publicKeys$: Observable<string[]>;
  storageKey: string;
  icons = Icons;
  iconSizes = IconSizes;
  hubConnection: HubConnection;
  sid: string;
  isDevnet: boolean;

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
    this.isDevnet = this._env.network !== Network.Devnet;
    this.storageKey = 'public-keys';
    this.form = this._fb.group({
      publicKey: ['', [Validators.required, Validators.minLength(32), Validators.maxLength(36)]],
      rememberMe: [false]
    });

    this.publicKeys = this._storage.getLocalStorage(this.storageKey, true) || [];

    this.publicKeys$ = this.publicKey.valueChanges
      .pipe(
        startWith(''),
        map(key => key ? this._filterPublicKeys(key) : this.publicKeys.slice()));
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
  }

  submit(): void {
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
          if (this.rememberMe.value === true && this.publicKeys.indexOf(publicKey) < 0) {
            this.publicKeys.push(publicKey);
            this._storage.setLocalStorage(this.storageKey, this.publicKeys, true);
          }

          this._context.setToken(token);
          this.error = false;
        }

        this.submitting = false;
      });
  }

  deleteDevnetPublicKey(key: string) {
    const updatedKeys = this.publicKeys.filter(publicKey => publicKey !== key);
    this._storage.setLocalStorage(this.storageKey, updatedKeys, true);
    this.publicKeys = updatedKeys;
    // Set timeout to clear the input after the option is selected.
    // Delete button is within a select option, so that action also gets triggered
    setTimeout(() => this.publicKey.setValue(''));
  }

  private _filterPublicKeys(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.publicKeys.filter(key => key.toLowerCase().includes(filterValue));
  }

  private async connectToSignalR(): Promise<void> {
    console.log(this._jwt.getToken())
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this._env.apiUrl}/socket`,  { accessTokenFactory: () => this._jwt.getToken() })
      .configureLogging(LogLevel.Warning)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onclose(() => {
      console.log('closing connection')
    });

    await this.hubConnection.start();

    this.sid = await this.hubConnection.invoke('GetStratisId');

    console.log(this.hubConnection.connectionId);

    this.hubConnection.on('OnAuthenticated', (token: string) => {
      console.log('onAuthenticated: ' + token);
      this._context.setToken(token);
    });
  }

  private async stopHubConnection(): Promise<void> {
    if (this.hubConnection && this.hubConnection.connectionId) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
  }

  async ngOnDestroy() {
    this.subscription.unsubscribe();
    await this.stopHubConnection();
  }
}
