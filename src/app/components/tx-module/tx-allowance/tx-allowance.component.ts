import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Subscription } from 'rxjs';
import { TxBase } from '../tx-base.component';

@Component({
  selector: 'opdex-tx-allowance',
  templateUrl: './tx-allowance.component.html',
  styleUrls: ['./tx-allowance.component.scss']
})
export class TxAllowanceComponent extends TxBase implements OnInit {
  @Input() data: any;
  pool: any;
  txHash: string;
  subscription = new Subscription();

  form: FormGroup;

  get token(): FormControl {
    return this.form.get('token') as FormControl;
  }

  get spender(): FormControl {
    return this.form.get('spender') as FormControl;
  }

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
      token: ['', [Validators.required]],
      spender: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    });
  }

  ngOnInit(): void { }

  ngOnChanges() {
    this.pool = this.data?.pool;
  }

  async submit() {
    const payload = {
      token: this.token,
      amount: parseFloat(this.amount.value).toFixed(this.pool.srcToken.decimals),
      recipient: this.spender.value
    }

    const response = await this._platformApi.approveAllowance(payload);
    if (response.hasError) {
      // handle
    }

    this.txHash = response.data;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
