import { UserContextService } from '@sharedServices/utility/user-context.service';
import { TokensModalComponent } from '../../modals-module/tokens-modal/tokens-modal.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, of, Observable } from 'rxjs';
import { debounceTime, take, distinctUntilChanged, switchMap, map, tap, catchError, filter } from 'rxjs/operators';
import { SignTxModalComponent } from 'src/app/components/modals-module/sign-tx-modal/sign-tx-modal.component';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { environment } from '@environments/environment';
import { Icons } from 'src/app/enums/icons';
import { TransactionTypes } from 'src/app/enums/transaction-types';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';
import { TxBase } from '../tx-base.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'opdex-tx-swap',
  templateUrl: './tx-swap.component.html',
  styleUrls: ['./tx-swap.component.scss']
})
export class TxSwapComponent extends TxBase implements OnDestroy{
  @Input() data: any;
  icons = Icons;
  tokenInExact = true;
  form: FormGroup;
  tokenInChanges$: Subscription;
  tokenOutChanges$: Subscription;
  txHash: string;
  tokenInDetails: any;
  tokenOutDetails: any;
  allowance: AllowanceValidation;
  transactionTypes = TransactionTypes;

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

  get deadline(): FormControl {
    return this.form.get('deadline') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    protected _userContext: UserContextService,
    protected _bottomSheet: MatBottomSheet
  ) {
    super(_userContext, _dialog, _bottomSheet);

    this.form = this._fb.group({
      tokenInAmount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      tokenIn: ['CRS', [Validators.required]],
      tokenOutAmount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      tokenOut: [null, [Validators.required]],
      deadline: [new Date(), [Validators.required]]
    });

    this.tokenInChanges$ = this.tokenInAmount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.tokenInExact = true),
        switchMap((value) => this.amountQuote(value)),
        tap((value: string) => this.tokenOutAmount.setValue(value, { emitEvent: false })),
        filter(_ => this.context.wallet !== undefined),
        switchMap(() => this.validateAllowance())
      ).subscribe();

    this.tokenOutChanges$ = this.tokenOutAmount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.tokenInExact = false),
        switchMap((value: string) => this.amountQuote(value)),
        tap((value: string) => this.tokenInAmount.setValue(value, { emitEvent: false })),
        filter(_ => this.context.wallet !== undefined),
        switchMap(() => this.validateAllowance())
      ).subscribe();
  }

  ngOnChanges() {
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
      // position: { top: '200px' },
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
          this.amountQuote(this.tokenInAmount.value)
            .pipe(
              tap((quote: string) => this.tokenOutAmount.setValue(quote, { emitEvent: false })),
              switchMap(() => this.validateAllowance()),
              take(1)
            ).subscribe();
        } else {
          this.tokenOut.setValue(rsp.address);
          this.tokenOutDetails = rsp;
          this.tokenInExact = false;
          this.amountQuote(this.tokenOutAmount.value)
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
      tokenOut: this.tokenOut.value,
      deadline: 0, // this.deadline.value.toISOString()
      tokenInAmount: this.tokenInAmount.value,
      tokenOutAmount: this.tokenOutAmount.value,
      tokenInExactAmount: this.tokenInExact,
      tokenInMaximumAmount: '10000000000000.00',
      tokenOutMinimumAmount: '0.00000001',
      recipient: this.context.wallet
    }


    this._platformApi
      .swapQuote(this.tokenIn.value, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote));
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
      this.amountQuote(tokenInAmount)
        .pipe(
          tap((quote: string) => this.tokenInAmount.setValue(quote, { emitEvent: false })),
          switchMap(() => this.validateAllowance()),
          take(1)
        ).subscribe();
    } else {
      this.tokenInExact = true;
      this.tokenInAmount.setValue(tokenOutAmount, { emitEvent: false });
      this.amountQuote(tokenOutAmount)
        .pipe(
          tap((quote: string) => this.tokenOutAmount.setValue(quote, { emitEvent: false })),
          switchMap(() => this.validateAllowance()),
          take(1)
        ).subscribe();
    }
  }

  amountQuote(value: string): Observable<string> {
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
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, this.tokenInAmount.value, this.tokenInDetails)),
        tap((rsp: AllowanceValidation) => this.allowance = rsp)
      );
  }

  ngOnDestroy() {
    if (this.tokenInChanges$) this.tokenInChanges$.unsubscribe();
    if (this.tokenOutChanges$) this.tokenOutChanges$.unsubscribe();
  }
}
