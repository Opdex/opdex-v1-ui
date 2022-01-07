import { OnDestroy } from '@angular/core';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-tx-mine-collect',
  templateUrl: './tx-mine-collect.component.html',
  styleUrls: ['./tx-mine-collect.component.scss']
})
export class TxMineCollectComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data: any;
  pool: ILiquidityPoolResponse;
  balanceError: boolean;
  subscription = new Subscription();

  constructor(
    private _platformApi: PlatformApiService,
    private _indexService: IndexService,
    protected _injector: Injector,
  ) {
    super(_injector);
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
      this._indexService.getLatestBlock$()
        .pipe(switchMap(_ => this.validateMiningBalance()))
        .subscribe());
  }

  submit(): void {
    this._platformApi
      .collectMiningRewardsQuote(this.pool.summary.miningPool.address)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote),
                   (errors: string[]) => this.quoteErrors = errors);
  }

  private validateMiningBalance(): Observable<boolean> {
    if (!!this.pool === false || !this.context?.wallet) return of(false);

    return this._validateMiningBalance$(this.pool, new FixedDecimal('0', this.pool.token.lp.decimals))
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
