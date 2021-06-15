import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';

@Component({
  selector: 'opdex-tx-provide-remove',
  templateUrl: './tx-provide-remove.component.html',
  styleUrls: ['./tx-provide-remove.component.scss']
})
export class TxProvideRemoveComponent extends TxBase implements OnInit {
  @Input() pool: any;

  form: FormGroup;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService
  ) {
    super(_dialog);

    this.form = this._fb.group({
      amount: ['', [Validators.required, Validators.min(.00000001)]]
    });
  }

  ngOnInit(): void { }

  // async submit(): Promise<void> {
  //   var payload = {
  //     token: this.token1.value,
  //     amountCrsDesired: Math.floor(this.token0Amount.value * 100_000_000),
  //     amountSrcDesired: Math.floor(this.token1Amount.value * this.token1Details.sats),
  //     amountCrsMin: 1,
  //     amountSrcMin: 1,
  //     to: 'PVTCoqP2FkWAiC158K7YUapo8UAgdRePrY'
  //   };

  //   console.log(payload);

  //   const response = await this._platformApi.addLiquidity(payload);
  //   if (response.hasError) {
  //     // handle
  //     console.log(response.error);
  //   }

  //   this.txHash = response.data.txHash;
  //   console.log(response.data);
  // }
}
