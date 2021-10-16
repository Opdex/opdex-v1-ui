import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { OnChanges, Injector } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { TxBase } from '../tx-base.component';
import { Icons } from 'src/app/enums/icons';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { take } from 'rxjs/operators';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { ApproveAllowanceRequest, IApproveAllowanceRequest } from '@sharedModels/platform-api/requests/tokens/approve-allowance-request';

@Component({
  selector: 'opdex-tx-allowance',
  templateUrl: './tx-allowance.component.html',
  styleUrls: ['./tx-allowance.component.scss']
})
export class TxAllowanceComponent extends TxBase implements OnChanges {
  @Input() data: any;
  icons = Icons;
  pool: ILiquidityPoolSummary;
  txHash: string;

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
    protected _injector: Injector,
    private _platformApiService: PlatformApiService
  ) {
    super(_injector);

    this.form = this._fb.group({
      token: ['', [Validators.required]],
      spender: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
    });
  }

  ngOnChanges() {
    this.pool = this.data?.pool;

    this.form.patchValue({
      token: this.data?.token,
      spender: this.data?.spender,
      amount: this.data?.amount || ''
    });
  }

  submit() {
    let amount = this.amount.value.toString().replace(/,/g, '');
    if (!amount.includes('.')) amount = `${amount}.00`;

    const payload: IApproveAllowanceRequest = new ApproveAllowanceRequest(
      {
        token: this.token.value,
        amount: amount,
        spender: this.spender.value
      }
    )

    if(payload.isValid){
      this._platformApiService
        .approveAllowanceQuote(payload.token, payload)
          .pipe(take(1))
          .subscribe((quote: ITransactionQuote) => this.quote(quote));
    }
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
  }
}
