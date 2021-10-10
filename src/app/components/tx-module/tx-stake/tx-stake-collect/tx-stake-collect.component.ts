import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-stake-collect',
  templateUrl: './tx-stake-collect.component.html',
  styleUrls: ['./tx-stake-collect.component.scss']
})
export class TxStakeCollectComponent extends TxBase implements OnChanges {
  @Input() data;
  pool: ILiquidityPoolSummary;
  form: FormGroup;

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
      liquidate: [false]
    });
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  submit(): void {
    const payload = {
      liquidate: this.liquidate.value
    };

    this._platformApi
      .collectStakingRewardsQuote(this.pool.address, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote));
  }
}
