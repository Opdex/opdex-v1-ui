import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { take, catchError } from 'rxjs/operators';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';

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

  get publicKey(): FormControl {
    return this.form.get('publicKey') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _api: PlatformApiService,
    private _context: UserContextService,
    private _router: Router,
  ) {
    this.form = this._fb.group({
      publicKey: ['', [Validators.required]]
    });
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

  submit(): void {
    this.submitting = true;
    this.error = false;

    this._api.auth(environment.marketAddress, this.publicKey.value)
      .pipe(take(1))
      .pipe(catchError(() => {
        this.error = true;
        return of(null);
      }))
      .subscribe((token: string) => {
        if (token !== null) {
          this._context.setToken(token);
          this.error = false;
        }

        this.submitting = false;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
