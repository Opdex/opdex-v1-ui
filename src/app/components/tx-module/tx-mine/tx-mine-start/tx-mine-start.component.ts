import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Observable } from 'rxjs';
import { debounceTime, map, switchMap, take } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Icons } from 'src/app/enums/icons';
import { TransactionTypes } from 'src/app/enums/transaction-types';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';

@Component({
  selector: 'opdex-tx-mine-start',
  templateUrl: './tx-mine-start.component.html',
  styleUrls: ['./tx-mine-start.component.scss']
})
export class TxMineStartComponent extends TxBase implements OnChanges {
  @Input() data;
  form: FormGroup;
  icons = Icons;
  pool: ILiquidityPoolSummary;
  allowance$: Observable<AllowanceValidation>;
  transactionTypes = TransactionTypes;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    protected _userContext: UserContextService,
    protected _bottomSheet: MatBottomSheet
  ) {
    super(_userContext, _dialog, _bottomSheet);

    this.form = this._fb.group({
      amount: ['', [Validators.required, Validators.min(.00000001)]]
    });

    this.allowance$ = this.amount.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((amount: string) => {
          const spender = this.data?.pool?.mining?.address;
          const token = this.data?.pool?.token?.lp?.address;

          return this._platformApi
            .getAllowance(this.context.wallet, spender, token)
            .pipe(map(allowanceResponse => new AllowanceValidation(allowanceResponse, amount, this.data?.pool?.token?.lp)));
        })
      );
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  submit(): void {
    let amount = this.amount.value.toString().replace(/,/g, '');
    if (!amount.includes('.')) amount = `${amount}.00`;

    const payload = {
      miningPool: this.pool.mining?.address,
      amount: amount
    }

    this._platformApi
      .startMiningQuote(payload.miningPool, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this.quote(quote);
        });
  }
}
