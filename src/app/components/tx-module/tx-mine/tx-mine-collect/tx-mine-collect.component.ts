import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-mine-collect',
  templateUrl: './tx-mine-collect.component.html',
  styleUrls: ['./tx-mine-collect.component.scss']
})
export class TxMineCollectComponent extends TxBase implements OnChanges {
  @Input() data: any;
  pool: ILiquidityPoolSummary;
  form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    protected _userContext: UserContextService,
    protected _bottomSheet: MatBottomSheet
  ) {
    super(_userContext, _dialog, _bottomSheet);

    this.form = this._fb.group({
      liquidate: [false, [Validators.required]]
    });
  }

  ngOnChanges() {
    this.pool = this.data?.pool;
  }

  submit(): void {
    const payload = {
      miningPool: this.pool.mining?.address,
    }

    this._platformApi
      .collectMiningRewardsQuote(payload.miningPool)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this.quote(quote);
        });
  }
}
