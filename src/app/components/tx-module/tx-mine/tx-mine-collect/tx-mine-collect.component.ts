import { Component, Input, OnChanges, Injector } from '@angular/core';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-mine-collect',
  templateUrl: './tx-mine-collect.component.html',
  styleUrls: ['./tx-mine-collect.component.scss']
})
export class TxMineCollectComponent extends TxBase implements OnChanges {
  @Input() data: any;
  pool: ILiquidityPoolSummary;

  constructor(
    private _platformApi: PlatformApiService,
    protected _injector: Injector,
  ) {
    super(_injector);
  }

  ngOnChanges() {
    this.pool = this.data?.pool;
  }

  submit(): void {
    this._platformApi
      .collectMiningRewardsQuote(this.pool.mining.address)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote));
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
  }
}
