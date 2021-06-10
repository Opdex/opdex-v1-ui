import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SignTxModalComponent } from 'src/app/components/modals-module/sign-tx-modal/sign-tx-modal.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { TokensModalComponent } from '@sharedComponents/modals-module/tokens-modal/tokens-modal.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-provide',
  templateUrl: './tx-provide.component.html',
  styleUrls: ['./tx-provide.component.scss']
})
export class TxProvideComponent implements OnInit {
  form: FormGroup;
  token1Details: any;
  txHash: string;

  get token0Amount(): FormControl {
    return this.form.get('token0Amount') as FormControl;
  }

  get token1Amount(): FormControl {
    return this.form.get('token1Amount') as FormControl;
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
      token1Amount: [null, [Validators.required, Validators.min(.00000001)]],
      token1: [null, [Validators.required]]
    });
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

  changeToken(): void {
    const ref = this._dialog.open(TokensModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: '',
      autoFocus: false
    });

    ref.afterClosed().pipe(take(1)).subscribe(rsp => {
      if (rsp != null) {
        this.token1.setValue(rsp.address);
        this.token1Details = rsp;
      }
    });
  }

  async submit(): Promise<void> {
    var payload = {
      token: this.token1.value,
      amountCrsDesired: Math.floor(this.token0Amount.value * 100_000_000),
      amountSrcDesired: Math.floor(this.token1Amount.value * this.token1Details.sats),
      amountCrsMin: 1,
      amountSrcMin: 1,
      to: 'PVTCoqP2FkWAiC158K7YUapo8UAgdRePrY'
    };

    console.log(payload);

    const response = await this._platformApi.addLiquidity(payload);
    if (response.hasError) {
      // handle
      console.log(response.error);
    }

    this.txHash = response.data.txHash;
    console.log(response.data);
  }
}
