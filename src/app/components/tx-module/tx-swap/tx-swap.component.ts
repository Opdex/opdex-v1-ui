import { TokensModalComponent } from '../../modals-module/tokens-modal/tokens-modal.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { debounce, debounceTime, take } from 'rxjs/operators';
import { SignTxModalComponent } from 'src/app/components/modals-module/sign-tx-modal/sign-tx-modal.component';

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

  get token0Amount(): FormControl {
    return this.form.get('token0Amount') as FormControl;
  }

  get token0AmountValue(): string {
    return parseFloat(this.token0Amount.value).toFixed(this.token0Details.decimals);
  }

  get token0(): FormControl {
    return this.form.get('token0') as FormControl;
  }

  get token1Amount(): FormControl {
    return this.form.get('token1Amount') as FormControl;
  }

  get token1AmountValue(): string {
    return parseFloat(this.token1Amount.value).toFixed(this.token1Details.decimals);
  }

  get token1(): FormControl {
    return this.form.get('token1') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _platformApi: PlatformApiService
  ) {
    this.form = this._fb.group({
      token0Amount: [null, [Validators.required, Validators.min(.00000001)]],
      token0: ['CRS', [Validators.required]],
      token1Amount: [null, [Validators.required, Validators.min(.00000001)]],
      token1: [null, [Validators.required]]
    });

    this.exactInput$ = this.token0Amount.valueChanges
      .pipe(debounceTime(300))
      .subscribe((change: string) => this.updateExactAmount(change));
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

      this.token1Details = this.data.pool.token;
      this.token1.setValue(this.token1Details.address);
    }
  }

  signTx(): void {
    this._dialog.open(SignTxModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: ''
    });
  }

  toggleToken0In(): void {
    this.token0In = !this.token0In;
  }

  updateExactAmount(change: string): void {
    this.quote();
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

  async submit() {
    const payload = {
      tokenIn: this.token0In ? this.token0.value : this.token1.value,
      tokenOut: !this.token0In ? this.token0.value : this.token1.value,
      tokenInAmount: this.token0In ? this.token0AmountValue : this.token1AmountValue,
      tokenOutAmount: !this.token0In ? this.token0AmountValue : this.token1AmountValue,
      tokenInExactAmount: this.token0In,
      tolerance: 0.1,
      market: "PUVKXiXNbvny8kVDnKAdfVZaUyvozMWKV4",
      recipient: "PTsyKGQJ3eD9jnhHZKtvDmCMyGVMNTHay6",
      walletName: "cirrusdev",
      walletAddress: "PTsyKGQJ3eD9jnhHZKtvDmCMyGVMNTHay6",
      walletPassword: "password"
    }

    const response = await this._platformApi.swap(payload);
    if (response.hasError) {
      // handle
    }

    this.txHash = response.data.txHash;
  }

  switch() {
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

  async quote() {
    const payload = {
      tokenIn: this.token0In ? this.token0.value : this.token1.value,
      tokenOut: !this.token0In ? this.token0.value : this.token1.value,
      tokenInAmount: this.token0In ? this.token0AmountValue : null,
      tokenOutAmount: !this.token0In ? this.token0AmountValue : null,
      market: "PUVKXiXNbvny8kVDnKAdfVZaUyvozMWKV4"
    };

    const response = await this._platformApi.getSwapQuote(payload);

    console.log(response.data);
    this.form.get("token1Amount").setValue(response.data);
  }

  ngOnDestroy() {
    if (this.exactInput$) this.exactInput$.unsubscribe();
  }
}
