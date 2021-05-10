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
  fromTokenDetails: any;
  toTokenDetails: any;

  get from(): FormControl {
    return this.form.get('from') as FormControl;
  }

  get fromToken(): FormControl {
    return this.form.get('fromToken') as FormControl;
  }

  get to(): FormControl {
    return this.form.get('to') as FormControl;
  }

  get toToken(): FormControl {
    return this.form.get('toToken') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _themeService: ThemeService,
    private _dialog: MatDialog,
    private _platformApi: PlatformApiService
  ) {
    this.form = this._fb.group({
      from: [null, [Validators.required, Validators.min(.00000001)]],
      fromToken: [null, [Validators.required]],
      to: [null, [Validators.required, Validators.min(.00000001)]],
      toToken: [null, [Validators.required]]
    });

    this.theme$ = this._themeService.getTheme();

    this.exactInput$ = this.from.valueChanges
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
    console.log(change);
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

        if (tokenField === 'fromToken') {
          this.fromTokenDetails = rsp;
        } else {
          this.toTokenDetails = rsp;
        }
      }
    });
  }

  async submit() {
    const payload = {
      tokenIn: !this.tokenInExactly ? this.fromToken.value : null,
      tokenOut: this.tokenInExactly ? this.fromToken.value : null,
      tokenInAmount: this.tokenInExactly ? this.from.value : "0",
      tokenOutAmount: !this.tokenInExactly ? this.from.value * 100000000 : "0",
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
    const from = this.from.value;
    const fromToken = this.fromToken.value;
    const to = this.to.value;
    const toToken = this.toToken.value;
    const fromTokenDetails = this.fromTokenDetails;
    const toTokenDetails = this.toTokenDetails;

    this.from.setValue(to);
    this.to.setValue(from);
    this.fromToken.setValue(toToken);
    this.toToken.setValue(fromToken);

    this.fromTokenDetails = toTokenDetails;
    this.toTokenDetails = fromTokenDetails;

    this.toggleTokenInExactly();
  }

  ngOnDestroy() {
    if (this.exactInput$) this.exactInput$.unsubscribe();
  }
}
