import { UserContextService } from '@sharedServices/user-context.service';
import { TokensModalComponent } from '../../modals-module/tokens-modal/tokens-modal.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, of, Observable } from 'rxjs';
import { debounceTime, take, distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';
import { SignTxModalComponent } from 'src/app/components/modals-module/sign-tx-modal/sign-tx-modal.component';
import { AllowanceValidation } from '@sharedModels/allowance-validation';

@Component({
  selector: 'opdex-tx-swap',
  templateUrl: './tx-swap.component.html',
  styleUrls: ['./tx-swap.component.scss']
})
export class TxSwapComponent implements OnDestroy{
  @Input() data: any;
  token0In = true;
  form: FormGroup;
  exactInput$: Subscription;
  txHash: string;
  token0Details: any;
  token1Details: any;
  context: any;
  allowance: AllowanceValidation;

  get token0Amount(): FormControl {
    return this.form.get('token0Amount') as FormControl;
  }

  get token0AmountValue(): string {
    return this.token0Amount.value;
  }

  get token0(): FormControl {
    return this.form.get('token0') as FormControl;
  }

  get token1Amount(): FormControl {
    return this.form.get('token1Amount') as FormControl;
  }

  get token1AmountValue(): string {
    return this.token1Amount.value;
  }

  get token1(): FormControl {
    return this.form.get('token1') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    private _userContext: UserContextService
  ) {
    this.context = _userContext.getUserContext();

    this.form = this._fb.group({
      token0Amount: ['', [Validators.required]],
      token0: ['CRS', [Validators.required]],
      token1Amount: ['', [Validators.required]],
      token1: [null, [Validators.required]]
    });

    this.exactInput$ = this.token0Amount.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => this.quote(value))
      )
      .subscribe(value => this.form.get("token1Amount").setValue(value));
  }

  ngOnChanges() {
    console.log(this.data);
    if (this.data?.pool) {
      this.token0Details = {
        name: "Cirrus",
        symbol: 'CRS',
        address: 'CRS',
        decimals: 8,
        sats: 100000000
      };

      this.token1Details = this.data.pool.token.src;
      this.token1.setValue(this.token1Details.address);
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

  toggleToken0In(): void {
    this.token0In = !this.token0In;
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
        const field = this.form.get(tokenField);
        field.setValue(rsp.address);

        if (tokenField === 'token0') {
          this.token0Details = rsp;
        } else {
          this.token1Details = rsp;
        }
      }
    });
  }

  submit() {
    const payload = {
      tokenIn: this.token0In ? this.token0.value : this.token1.value,
      tokenOut: !this.token0In ? this.token0.value : this.token1.value,
      tokenInAmount: this.token0In ? this.token0AmountValue : this.token1AmountValue,
      tokenOutAmount: !this.token0In ? this.token0AmountValue : this.token1AmountValue,
      tokenInExactAmount: this.token0In,
      tolerance: 0.1,
      recipient: this.context.wallet
    }

    this.signTx({ payload, transactionType: 'swap'});
  }

  switch() {
    // Intentionally killing this process for now, it's bugged.
    return ;

    const token0Amount = this.token0Amount.value;
    const token0 = this.token0.value;
    const token1Amount = this.token1Amount.value;
    const token1 = this.token1.value;
    const token0Details = this.token0Details;
    const token1Details = this.token1Details;

    this.token0Amount.setValue(token1Amount);
    this.token1Amount.setValue(token0Amount);
    this.token0.setValue(token1);
    this.token1.setValue(token0);

    this.token0Details = token1Details;
    this.token1Details = token0Details;

    this.toggleToken0In();
  }

  quote(value: string): Observable<string> {
    if (!value || value === '0' || !value.includes('.')) {
      return of('0');
    }

    const payload = {
      tokenIn: this.token0In ? this.token0.value : this.token1.value,
      tokenOut: !this.token0In ? this.token0.value : this.token1.value,
      tokenInAmount: this.token0In ? this.token0AmountValue : null,
      tokenOutAmount: !this.token0In ? this.token0AmountValue : null
    };

    return this._platformApi.getSwapQuote(payload).pipe(
      switchMap((amount: string) => {
        const spender = this.data?.pool?.address;
        const token = payload.tokenIn;

        if (payload.tokenIn === 'CRS') {
          return of(amount);
        }

        const tokenDecimals = payload.tokenIn == this.token0Details.address ? this.token0Details.decimals : this.token1Details.decimals;

        return this._platformApi
            .getAllowance(this.context.wallet, spender, token)
            .pipe(
              map(allowanceResponse => new AllowanceValidation(allowanceResponse, amount, tokenDecimals)),
              map((rsp: AllowanceValidation) => rsp.requestToSpend)
            );
      })
    );
  }

  ngOnDestroy() {
    if (this.exactInput$) this.exactInput$.unsubscribe();
  }
}
