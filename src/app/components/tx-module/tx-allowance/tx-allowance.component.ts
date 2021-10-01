import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { OnChanges } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { TxBase } from '../tx-base.component';
import { Icons } from 'src/app/enums/icons';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';
import { take } from 'rxjs/operators';
import { DecimalStringRegex } from '@sharedLookups/regex';

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
    protected _dialog: MatDialog,
    protected _userContext: UserContextService,
    protected _bottomSheet: MatBottomSheet,
    private _platformApiService: PlatformApiService
  ) {
    super(_userContext, _dialog, _bottomSheet);

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

    const payload = {
      token: this.token.value,
      amount: amount,
      spender: this.spender.value
    }

    this._platformApiService
      .approveAllowanceQuote(payload.token, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this.quote(quote);
        });
  }
}
