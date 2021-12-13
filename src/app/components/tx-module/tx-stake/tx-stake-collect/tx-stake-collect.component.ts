import { CollectStakingRewardsRequest } from '@sharedModels/platform-api/requests/liquidity-pools/collect-staking-rewards-request';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-stake-collect',
  templateUrl: './tx-stake-collect.component.html',
  styleUrls: ['./tx-stake-collect.component.scss']
})
export class TxStakeCollectComponent extends TxBase implements OnChanges {
  @Input() data;
  pool: ILiquidityPoolResponse;
  form: FormGroup;

  get liquidate(): FormControl {
    return this.form.get('liquidate') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    protected _injector: Injector,
  ) {
    super(_injector);

    this.form = this._fb.group({
      liquidate: [false]
    });
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  submit(): void {
    const request = new CollectStakingRewardsRequest(this.liquidate.value);

    this._platformApi
      .collectStakingRewardsQuote(this.pool.address, request.payload)
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
