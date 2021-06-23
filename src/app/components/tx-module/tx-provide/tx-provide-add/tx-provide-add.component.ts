import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-provide-add',
  templateUrl: './tx-provide-add.component.html',
  styleUrls: ['./tx-provide-add.component.scss']
})
export class TxProvideAddComponent extends TxBase implements OnInit {
  @Input() pool: any;
  txHash: string;
  subscription = new Subscription();

  form: FormGroup;

  get amountCrs(): FormControl {
    return this.form.get('amountCrs') as FormControl;
  }

  get amountSrc(): FormControl {
    return this.form.get('amountSrc') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService
  ) {
    super(_dialog);

    this.form = this._fb.group({
      amountCrs: ['', [Validators.required]],
      amountSrc: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.amountCrs.valueChanges.pipe(debounceTime(300))
        .subscribe(async value => {
          if (this.pool) {
            const quote = await this.quote(value, 'CRS');
            this.amountSrc.setValue(quote, { emitEvent: false });
          }
        }
      )
    );

    this.subscription.add(
      this.amountSrc.valueChanges.pipe(debounceTime(300))
        .subscribe(async value => {
          if (this.pool) {
            const quote = await this.quote(value, this.pool?.token?.address);
            this.amountCrs.setValue(quote, { emitEvent: false });
          }
        }
      )
    );
  }

  async quote(value: string, token: string): Promise<string> {
    const payload = {
      amountIn: parseFloat(value).toFixed(token === 'CRS' ? 8 : this.pool.srcToken.decimals),
      tokenIn: token,
      pool: this.pool.address
    };

    const quote = await this._platformApi.quoteAddLiquidity(payload);

    if (quote.hasError) {
      return '0.00';
    }

    return quote.data;
  }

  async submit() {
    const payload = {
      amountCrs: parseFloat(this.amountCrs.value).toFixed(8),
      amountSrc: parseFloat(this.amountSrc.value).toFixed(this.pool.srcToken.decimals),
      tolerance: .001,
      recipient: environment.walletAddress,
      liquidityPool: this.pool.address
    }

    const response = await this._platformApi.addLiquidity(payload);
    if (response.hasError) {
      // handle
    }

    this.txHash = response.data;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
