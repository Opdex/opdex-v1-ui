import { UserContextService } from '@sharedServices/utility/user-context.service';
import { TokensModalComponent } from '../../modals-module/tokens-modal/tokens-modal.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, of, Observable } from 'rxjs';
import { debounceTime, take, distinctUntilChanged, switchMap, map, tap, catchError } from 'rxjs/operators';
import { SignTxModalComponent } from 'src/app/components/modals-module/sign-tx-modal/sign-tx-modal.component';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { environment } from '@environments/environment';

@Component({
  selector: 'opdex-tx-swap',
  templateUrl: './tx-swap.component.html',
  styleUrls: ['./tx-swap.component.scss']
})
export class TxSwapComponent implements OnDestroy{
  @Input() data: any;
  tokenInExact = true;
  form: FormGroup;
  tokenInChanges$: Subscription;
  tokenOutChanges$: Subscription;
  txHash: string;
  tokenInDetails: any;
  tokenOutDetails: any;
  context: any;
  allowance: AllowanceValidation;

  get tokenInAmount(): FormControl {
    return this.form.get('tokenInAmount') as FormControl;
  }

  get tokenIn(): FormControl {
    return this.form.get('tokenIn') as FormControl;
  }

  get tokenOutAmount(): FormControl {
    return this.form.get('tokenOutAmount') as FormControl;
  }

  get tokenOut(): FormControl {
    return this.form.get('tokenOut') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    private _userContext: UserContextService
  ) {
    this.context = this._userContext.getUserContext();

    this.form = this._fb.group({
      tokenInAmount: ['', [Validators.required]],
      tokenIn: ['CRS', [Validators.required]],
      tokenOutAmount: ['', [Validators.required]],
      tokenOut: [null, [Validators.required]]
    });

    this.tokenInChanges$ = this.tokenInAmount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap((value: string) => this.tokenInExact = true),
        switchMap((value) => this.quote(value)),
        tap((value: string) => this.tokenOutAmount.setValue(value, { emitEvent: false })),
        switchMap(() => this.validateAllowance())
      ).subscribe();

    this.tokenOutChanges$ = this.tokenOutAmount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap((value: string) => this.tokenInExact = false),
        switchMap((value: string) => this.quote(value)),
        tap((value: string) => this.tokenInAmount.setValue(value, { emitEvent: false })),
        switchMap(() => this.validateAllowance())
      ).subscribe();
  }

  ngOnChanges() {
    console.log(this.data);
    if (this.data?.pool) {
      this.tokenInDetails = {
        name: "Cirrus",
        symbol: 'CRS',
        address: 'CRS',
        decimals: 8,
        sats: 100000000
      };

      this.tokenOutDetails = this.data.pool.token.src;
      this.tokenOut.setValue(this.tokenOutDetails.address);
    }
  }

  signTx(data: any): void {
    this._dialog.open(SignTxModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  data,
      panelClass: ''
    });
  }

  changeToken(tokenField: string): void {
    const ref = this._dialog.open(TokensModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {
        filter: []
      },
      panelClass: '',
      autoFocus: false
    });

    ref.afterClosed().pipe(take(1)).subscribe(rsp => {
      if (rsp != null) {
        // Todo: trim or pad token values based on the new selected tokens decimals
        if (tokenField === 'tokenIn') {
          this.tokenIn.setValue(rsp.address);
          this.tokenInDetails = rsp;
          this.tokenInExact = true;
          this.quote(this.tokenInAmount.value)
            .pipe(
              tap((quote: string) => this.tokenOutAmount.setValue(quote, { emitEvent: false })),
              switchMap(() => this.validateAllowance()),
              take(1)
            ).subscribe();
        } else {
          this.tokenOut.setValue(rsp.address);
          this.tokenOutDetails = rsp;
          this.tokenInExact = false;
          this.quote(this.tokenOutAmount.value)
            .pipe(
              tap((quote: string) => this.tokenInAmount.setValue(quote, { emitEvent: false })),
              switchMap(() => this.validateAllowance()),
              take(1)
            ).subscribe();
        }
      }
    });
  }

  submit() {
    const payload = {
      tokenIn: this.tokenIn.value,
      tokenOut: this.tokenOut.value,
      tokenInAmount: this.tokenInAmount.value,
      tokenOutAmount: this.tokenOutAmount.value,
      tokenInExactAmount: this.tokenInExact,
      tolerance: 0.1,
      recipient: this.context.wallet
    }

    this.signTx({ payload, transactionType: 'swap'});
  }

  switch() {
    const tokenInAmount = this.tokenInAmount.value;
    const tokenIn = this.tokenIn.value;
    const tokenOutAmount = this.tokenOutAmount.value;
    const tokenOut = this.tokenOut.value;
    const tokenInDetails = this.tokenInDetails;
    const tokenOutDetails = this.tokenOutDetails;

    this.tokenInDetails = tokenOutDetails;
    this.tokenOutDetails = tokenInDetails;

    this.tokenIn.setValue(tokenOut, { emitEvent: false });
    this.tokenOut.setValue(tokenIn, { emitEvent: false });

    if (this.tokenInExact) {
      this.tokenInExact = false;
      this.tokenOutAmount.setValue(tokenInAmount, { emitEvent: false });
      this.quote(tokenInAmount)
        .pipe(
          tap((quote: string) => this.tokenInAmount.setValue(quote, { emitEvent: false })),
          switchMap(() => this.validateAllowance()),
          take(1)
        ).subscribe();
    } else {
      this.tokenInExact = true;
      this.tokenInAmount.setValue(tokenOutAmount, { emitEvent: false });
      this.quote(tokenOutAmount)
        .pipe(
          tap((quote: string) => this.tokenOutAmount.setValue(quote, { emitEvent: false })),
          switchMap(() => this.validateAllowance()),
          take(1)
        ).subscribe();
    }
  }

  quote(value: string): Observable<string> {
    if (!value || value.replace('0', '') === '.' || !value.includes('.')) {
      return of('0.00');
    }

    const payload = {
      tokenIn: this.tokenIn.value,
      tokenOut: this.tokenOut.value,
      tokenInAmount: this.tokenInExact ? value : null,
      tokenOutAmount: !this.tokenInExact ? value : null
    };

    return this._platformApi.getSwapQuote(payload)
      .pipe(catchError(() => of('0.00')));
  }

  validateAllowance(): Observable<AllowanceValidation> {
    const spender = environment.routerAddress;

    if (this.tokenIn.value === 'CRS') {
      return of(null);
    }

    return this._platformApi.getAllowance(this.context.wallet, spender, this.tokenIn.value)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, this.tokenInAmount.value, this.tokenInDetails.decimals)),
        tap((rsp: AllowanceValidation) => this.allowance = rsp)
      );
  }

  ngOnDestroy() {
    if (this.tokenInChanges$) this.tokenInChanges$.unsubscribe();
    if (this.tokenOutChanges$) this.tokenOutChanges$.unsubscribe();
  }
}
