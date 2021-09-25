import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';
import { take } from 'rxjs/operators';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-tx-stake-stop',
  templateUrl: './tx-stake-stop.component.html',
  styleUrls: ['./tx-stake-stop.component.scss']
})
export class TxStakeStopComponent extends TxBase implements OnChanges {
  @Input() data;
  icons = Icons;
  form: FormGroup;
  pool: ILiquidityPoolSummary;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get liquidate(): FormControl {
    return this.form.get('liquidate') as FormControl;
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
      amount: ['', [Validators.required, Validators.min(.00000001)]],
      liquidate: [false]
    });
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  submit(): void {
    let amount = this.amount.value.toString().replace(/,/g, '');
    if (!amount.includes('.')) amount = `${amount}.00`;

    const payload = {
      liquidityPool: this.pool.address,
      amount: amount,
      liquidate: this.liquidate.value
    }

    this._platformApi
      .stopStakingQuote(payload.liquidityPool, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this.quote(quote);
        });
  }
}
