import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { IndexService } from '@sharedServices/platform/index.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { TransactionView } from '@sharedModels/transaction-view';
import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { skip, filter, switchMap } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'opdex-pool-preview',
  templateUrl: './pool-preview.component.html',
  styleUrls: ['./pool-preview.component.scss']
})
export class PoolPreviewComponent implements OnDestroy {
  @Input() pool: LiquidityPool;
  @Input() view: TransactionView;
  @Output() onPoolChange: EventEmitter<LiquidityPool> = new EventEmitter();
  iconSizes = IconSizes;
  icons = Icons;
  subscription = new Subscription();

  constructor(
    private _liquidityPoolsService: LiquidityPoolsService,
    private _indexService: IndexService
  ) {
    this.subscription.add(
      this._indexService.latestBlock$
        .pipe(
          skip(1),
          filter(_ => !!this.pool),
          switchMap(_ => this._liquidityPoolsService.getLiquidityPool(this.pool.address)))
        .subscribe((pool: LiquidityPool) => this.pool = pool));
  }

  clearPool(): void {
    this.pool = null;
  }

  selectLiquidityPool(pool: LiquidityPool): void {
    this.pool = pool;
    this.onPoolChange.emit(this.pool);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
