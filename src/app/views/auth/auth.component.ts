import { StorageService } from './../../services/utility/storage.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { take, catchError, startWith, map } from 'rxjs/operators';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';

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
  copied: boolean;
  publicKeys: string[];
  publicKeys$: Observable<string[]>;
  storageKey: string;

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
    private _storage: StorageService
  ) {
    this.storageKey = `${environment.network}-public-keys`;
    this.form = this._fb.group({
      publicKey: ['', [Validators.required]],
      rememberMe: [false]
    });

    this.publicKeys = this._storage.getLocalStorage(this.storageKey, true) || [];

    this.publicKeys$ = this.publicKey.valueChanges
      .pipe(
        startWith(''),
        map(key => key ? this._filterPublicKeys(key) : this.publicKeys.slice()));
  }

  private _filterPublicKeys(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.publicKeys.filter(key => key.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    this.subscription.add(
      this._context.getUserContext$()
        .subscribe(context => {
          if (context?.wallet) {
            this._router.navigateByUrl('/');
          }
        }));
  }

  copyHandler() {
    this.copied = true;
    setTimeout(() => this.copied = false, 1000);
  }

  submit(): void {
    this.submitting = true;
    this.error = false;
    const publicKey = this.publicKey.value; // Make copy, prevents changes during loading

    this._api.auth(environment.marketAddress, publicKey)
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

  deletePublicKey(key: string) {
    const updatedKeys = this.publicKeys.filter(publicKey => publicKey !== key);

    this._storage.setLocalStorage(this.storageKey, updatedKeys, true);

    this.publicKeys = updatedKeys;

    // Set timeout to clear the input after the option is selected.
    // Delete button is within a select option, so that action also gets triggered
    setTimeout(() => this.publicKey.setValue(''));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
