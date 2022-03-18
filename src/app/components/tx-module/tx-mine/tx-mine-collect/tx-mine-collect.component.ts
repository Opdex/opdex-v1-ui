import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { OnDestroy } from '@angular/core';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';
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
  pool: LiquidityPool;
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
      this._indexService.latestBlock$
        .pipe(switchMap(_ => this.validateMiningBalance()))
        .subscribe());
  }

  submit(): void {
    this._platformApi
      .collectMiningRewardsQuote(this.pool.miningPool.address)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote),
                   (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  private validateMiningBalance(): Observable<boolean> {
    if (!!this.pool === false || !this.context?.wallet) return of(false);

    return this._validateMiningBalance$(this.pool, FixedDecimal.Zero(this.pool.tokens.lp.decimals))
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
