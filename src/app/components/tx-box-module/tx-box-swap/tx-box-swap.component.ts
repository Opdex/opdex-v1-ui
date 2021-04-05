import { Address } from 'bitcore-lib';
import { TokensModalComponent } from '../../modals-module/tokens-modal/tokens-modal.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, OnInit } from '@angular/core';
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
export class TxBoxSwapComponent implements OnInit {
  tokenInExactly = true;
  form: FormGroup;
  theme$: Observable<string>;
  exactInput$: Subscription;
  txHash: string;
  fromTokenDetails: any;
  toTokenDetails: any;
  tokens = [{
    name: 'Bitcoin (Wrapped)',
    ticker: 'xBTC',
    address: 'PN4GHHJwbeed3UqMH5fVRkfecMF7BANGSp'
  }, {
    name: 'Cirrus',
    ticker: 'CRS',
    address: null
  }];

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

  constructor(private _fb: FormBuilder, private _themeService: ThemeService,
    private _dialog: MatDialog, private _platformApi: PlatformApiService) {
    this.form = this._fb.group({
      from: [null, [Validators.required, Validators.min(.00000001)]],
      fromToken: [this.tokens[0].address, [Validators.required]],
      to: ["10", [Validators.required, Validators.min(.00000001)]],
      toToken: [this.tokens[1].address, [Validators.required]]
    });

    this.theme$ = this._themeService.getTheme();

    this.exactInput$ = this.from.valueChanges.subscribe((change: string) => this.updateExactAmount(change));
  }

  ngOnInit(): void { }

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
      console.log(response.error);
    }

    this.txHash = response.data.txHash;
    console.log(response.data);
  }

  ngOnDestroy() {
    if (this.exactInput$) this.exactInput$.unsubscribe();
  }
}
