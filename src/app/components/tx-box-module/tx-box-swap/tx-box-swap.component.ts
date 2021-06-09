import { TokensModalComponent } from '../../modals-module/tokens-modal/tokens-modal.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '@sharedServices/theme.service';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { SignTxModalComponent } from 'src/app/components/modals-module/sign-tx-modal/sign-tx-modal.component';

@Component({
  selector: 'opdex-tx-box-swap',
  templateUrl: './tx-box-swap.component.html',
  styleUrls: ['./tx-box-swap.component.scss']
})
export class TxBoxSwapComponent implements OnDestroy{
  tokenInExactly = true;
  form: FormGroup;
  theme$: Observable<string>;
  exactInput$: Subscription;
  txHash: string;
  tokenInDetails: any;
  tokenOutDetails: any;

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
    private _themeService: ThemeService,
    private _dialog: MatDialog,
    private _platformApi: PlatformApiService
  ) {
    this.form = this._fb.group({
      tokenInAmount: [null, [Validators.required, Validators.min(.00000001)]],
      tokenIn: [null, [Validators.required]],
      tokenOutAmount: [null, [Validators.required, Validators.min(.00000001)]],
      tokenOut: [null, [Validators.required]]
    });

    this.theme$ = this._themeService.getTheme();

    this.exactInput$ = this.tokenInAmount.valueChanges
      .subscribe((change: string) => this.updateExactAmount(change));
  }

  signTx(): void {
    this._dialog.open(SignTxModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: ''
    });
  }

  toggleTokenInExactly(): void {
    this.tokenInExactly = !this.tokenInExactly;
  }

  updateExactAmount(change: string): void {
    this.quote();
  }

  changeToken(tokenField: string): void {
    const ref = this._dialog.open(TokensModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: '',
      autoFocus: false
    });

    ref.afterClosed().pipe(take(1)).subscribe(rsp => {
      if (rsp != null) {
        const field = this.form.get(tokenField);
        field.setValue(rsp.address);

        if (tokenField === 'tokenIn') {
          this.tokenInDetails = rsp;
        } else {
          this.tokenOutDetails = rsp;
        }
      }
    });
  }

  async submit() {
    const payload = {
      tokenIn: !this.tokenInExactly ? this.tokenIn.value : null,
      tokenOut: this.tokenInExactly ? this.tokenIn.value : null,
      tokenInAmount: this.tokenInExactly ? this.tokenInAmount.value : "0.00",
      tokenOutAmount: !this.tokenInExactly ? this.tokenInAmount.value : "0.00",
      tokenInExactAmount: this.tokenInExactly,
      tolerance: 0,
      to: "PVTCoqP2FkWAiC158K7YUapo8UAgdRePrY"
    }

    const response = await this._platformApi.swap(payload);
    if (response.hasError) {
      // handle
    }

    this.txHash = response.data.txHash;
  }

  switch() {
    const tokenInAmount = this.tokenInAmount.value;
    const tokenIn = this.tokenIn.value;
    const tokenOutAmount = this.tokenOutAmount.value;
    const tokenOut = this.tokenOut.value;
    const tokenInDetails = this.tokenInDetails;
    const tokenOutDetails = this.tokenOutDetails;

    this.tokenInAmount.setValue(tokenOutAmount);
    this.tokenOutAmount.setValue(tokenInAmount);
    this.tokenIn.setValue(tokenOut);
    this.tokenOut.setValue(tokenIn);

    this.tokenInDetails = tokenOutDetails;
    this.tokenOutDetails = tokenInDetails;

    this.toggleTokenInExactly();
  }

  async quote() {
    const payload = {
      tokenIn: !this.tokenInExactly ? this.tokenIn.value : this.tokenOut.value,
      tokenOut: this.tokenInExactly ? this.tokenIn.value : this.tokenOut.value,
      tokenInAmount: this.tokenInExactly ? this.tokenInAmount.value : "0.00",
      tokenOutAmount: !this.tokenInExactly ? this.tokenInAmount.value : "0.00",
      market: "P8uhn2EFsAZ28mzzmtpttAMVcTNzncLeiC"
    };

    const response = await this._platformApi.getSwapQuote(payload);

    console.log(response.data);
    this.form.get("tokenOutAmount").setValue(response.data);
  }

  ngOnDestroy() {
    if (this.exactInput$) this.exactInput$.unsubscribe();
  }
}
