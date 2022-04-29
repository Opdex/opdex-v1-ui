import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { CollectStakingRewardsRequest } from '@sharedModels/platform-api/requests/liquidity-pools/collect-staking-rewards-request';
import { Component, Input, OnChanges, Injector, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { take, tap, switchMap } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';

@Component({
  selector: 'opdex-tx-stake-collect',
  templateUrl: './tx-stake-collect.component.html',
  styleUrls: ['./tx-stake-collect.component.scss']
})
export class TxStakeCollectComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data;
  pool: LiquidityPool;
  form: FormGroup;
  balanceError: boolean;
  subscription = new Subscription();

  get liquidate(): FormControl {
    return this.form.get('liquidate') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    protected _injector: Injector
  ) {
    super(_injector);

    this.form = this._fb.group({
      liquidate: [false]
    });
  }

  ngOnChanges(): void {
    const pool = this.data?.pool;
    if (!!pool === false) {
      return; // No pool found
    }

    if (!this.subscription.closed && this.pool?.address !== pool.address) {
      this.subscription.unsubscribe();
      this.subscription = new Subscription();
    }

    this.pool = pool;

    this.subscription.add(
      this._indexService.latestBlock$
        .pipe(switchMap(_ => this.validateStakingBalance()))
        .subscribe());
  }

  submit(): void {
    const request = new CollectStakingRewardsRequest(this.liquidate.value);

    this._platformApi
      .collectStakingRewardsQuote(this.pool.address, request.payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote),
                   (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  private validateStakingBalance(): Observable<boolean> {
    if (!!this.pool.tokens.staking === false || !this.context?.wallet) {
      return of(false);
    }

    return this._validateStakingBalance$(this.pool, FixedDecimal.Zero(this.pool.tokens.staking.decimals))
      .pipe(tap(result => this.balanceError = !result))
  }

  destroyContext$(): void {
    this.context$.unsubscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyContext$();
  }
}
