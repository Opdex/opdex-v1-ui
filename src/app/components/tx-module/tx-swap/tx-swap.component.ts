import { MathService } from '@sharedServices/utility/math.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { TokensModalComponent } from '../../modals-module/tokens-modal/tokens-modal.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, of, Observable } from 'rxjs';
import { debounceTime, take, distinctUntilChanged, switchMap, map, tap, catchError, filter } from 'rxjs/operators';
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
  tokenInDetails: any;
  tokenOutDetails: any;
  allowance: AllowanceValidation;
  transactionTypes = TransactionTypes;
  showMore: boolean = false;
  tokenInFiatValue: string;
  tokenInMaxFiatValue: string;
  tokenOutFiatValue: string;
  tokenOutMinFiatValue: string;
  setTolerance = 0.1;
  tokenInMax: string;
  tokenOutMin: string;

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

  get tolerance(): FormControl {
    return this.form.get('tolerance') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    private _mathService: MathService,
    protected _dialog: MatDialog,
    protected _userContext: UserContextService,
    protected _bottomSheet: MatBottomSheet
  ) {
    super(_userContext, _dialog, _bottomSheet);

    this.form = this._fb.group({
      tokenInAmount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      tokenIn: ['CRS', [Validators.required]],
      tokenOutAmount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      tokenOut: [null, [Validators.required]],
      deadline: [''],
      tolerance: ['']
    });

    this.tokenInChanges$ = this.tokenInAmount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.tokenInExact = true),
        switchMap((value) => this.amountQuote(value)),
        tap((value: string) => this.tokenOutAmount.setValue(value, { emitEvent: false })),
        tap(_ => this.calcTolerance()),
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
        tap(_ => this.calcTolerance()),
        filter(_ => this.context.wallet !== undefined),
        switchMap(() => this.validateAllowance())
      ).subscribe();
  }

  ngOnChanges() {
    if (this.data?.pool) {
      this.tokenInDetails = this.data.pool.token.crs;
      this.tokenOutDetails = this.data.pool.token.src;

      this.tokenOut.setValue(this.tokenOutDetails.address);
    }
  }

  changeToken(tokenField: string): void {
    const ref = this._dialog.open(TokensModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  { filter: [] },
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
              tap(_ => this.calcTolerance()),
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
              tap(_ => this.calcTolerance()),
              switchMap(() => this.validateAllowance()),
              take(1)
            ).subscribe();
        }
      }
    });
  }

  submit() {
    let deadline = 0;

    const payload = {
      tokenOut: this.tokenOut.value,
      tokenInAmount: this.tokenInAmount.value,
      tokenOutAmount: this.tokenOutAmount.value,
      tokenInExactAmount: this.tokenInExact,
      recipient: this.context.wallet,
      tokenInMaximumAmount: this.tokenInMax,
      tokenOutMinimumAmount: this.tokenOutMin,
      deadline: deadline
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
          tap(_ => this.calcTolerance()),
          switchMap(() => this.validateAllowance()),
          take(1)
        ).subscribe();
    } else {
      this.tokenInExact = true;
      this.tokenInAmount.setValue(tokenOutAmount, { emitEvent: false });
      this.amountQuote(tokenOutAmount)
        .pipe(
          tap((quote: string) => this.tokenOutAmount.setValue(quote, { emitEvent: false })),
          tap(_ => this.calcTolerance()),
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

    return this._platformApi.getSwapQuote(payload).pipe(catchError(() => of('0.00')));
  }

  validateAllowance(): Observable<AllowanceValidation> {
    const spender = environment.routerAddress;

    if (this.tokenIn.value === 'CRS') {
      return of(null);
    }

    return this._platformApi.getAllowance(this.context.wallet, spender, this.tokenIn.value)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, this.tokenInAmount.value, this.tokenInDetails)),
        tap((rsp: AllowanceValidation) => this.allowance = rsp));
  }

  calcTolerance(tolerance?: number) {
    if (tolerance) this.setTolerance = tolerance;

    if (this.setTolerance > 99.99 || this.setTolerance < .01) return;
    if (!this.tokenInAmount.value || !this.tokenInAmount.value) return;

    this.tokenInMax = this._mathService.multiply(this.formatDecimalNumber(this.tokenInAmount.value, this.tokenInDetails.decimals), 1 + (this.setTolerance / 100));

    let tokenOutValue = this.formatDecimalNumber(this.tokenOutAmount.value, this.tokenOutDetails.decimals);
    let minTolerance = this.formatDecimalNumber(this._mathService.multiply(tokenOutValue, this.setTolerance / 100), this.tokenOutDetails.decimals);
    this.tokenOutMin = this._mathService.subtract(tokenOutValue, minTolerance);

    this.tokenInFiatValue = this._mathService.multiply(this.formatDecimalNumber(this.tokenInAmount.value, this.tokenInDetails.decimals), this.tokenInDetails.summary.price.close);
    this.tokenOutFiatValue = this._mathService.multiply(this.formatDecimalNumber(this.tokenOutAmount.value, this.tokenOutDetails.decimals), this.tokenOutDetails.summary.price.close);
    this.tokenInMaxFiatValue = this._mathService.multiply(this.formatDecimalNumber(this.tokenInMax, this.tokenInDetails.decimals), this.tokenInDetails.summary.price.close);
    this.tokenOutMinFiatValue = this._mathService.multiply(this.formatDecimalNumber(this.tokenOutMin, this.tokenOutDetails.decimals), this.tokenOutDetails.summary.price.close);
  }

  private formatDecimalNumber(value: string, decimals: number): string {
    if (!value.includes('.')) value = `${value}.`.padEnd(value.length + 1 + decimals, '0');

    if (value.startsWith('.')) value = `0${value}`;

    var parts = value.split('.');

    return `${parts[0]}.${parts[1].padEnd(decimals, '0')}`;
  }

  toggleShowMore(value: boolean) {
    this.showMore = value;
  }

  calcDeadline(minutes: number) {

  }

  ngOnDestroy() {
    if (this.tokenInChanges$) this.tokenInChanges$.unsubscribe();
    if (this.tokenOutChanges$) this.tokenOutChanges$.unsubscribe();
  }
}
