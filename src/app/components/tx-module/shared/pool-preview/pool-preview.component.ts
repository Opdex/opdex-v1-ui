import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { Token } from '@sharedModels/ui/tokens/token';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IndexService } from '@sharedServices/platform/index.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionView } from '@sharedModels/transaction-view';
import { Component, EventEmitter, Input, Output, OnDestroy, OnChanges } from '@angular/core';
import { map, startWith, tap, skip, filter, switchMap } from 'rxjs/operators';
import { LiquidityPoolsFilter, LpOrderBy } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Icons } from 'src/app/enums/icons';

interface IPoolPreviewRecord {
  token: Token;
  supply: FixedDecimal;
  percentageChange: FixedDecimal;
  price: FixedDecimal;
}

@Component({
  selector: 'opdex-pool-preview',
  templateUrl: './pool-preview.component.html',
  styleUrls: ['./pool-preview.component.scss']
})
export class PoolPreviewComponent implements OnChanges, OnDestroy {
  @Input() pool: LiquidityPool;
  @Input() view: TransactionView;
  poolForm: FormGroup;
  pools: LiquidityPool[];
  filteredPools$: Observable<LiquidityPool[]>;
  pools$: Observable<LiquidityPool[]>;
  iconSizes = IconSizes;
  icons = Icons;
  subscription = new Subscription();
  poolPreviewRecords: IPoolPreviewRecord[] = [];

  @Output() onPoolChange: EventEmitter<LiquidityPool> = new EventEmitter();

  get poolControl(): FormControl {
    return this.poolForm.get('poolControl') as FormControl;
  }

  get showStaking(): boolean {
    return this.view === TransactionView.stake;
  }

  get showMining(): boolean {
    return this.view === TransactionView.mine;
  }

  get showReserves(): boolean {
    return this.view === TransactionView.swap || this.view === TransactionView.provide;
  }

  constructor(
    private _fb: FormBuilder,
    private _liquidityPoolsService: LiquidityPoolsService,
    private _indexService: IndexService
  ) {
    this.poolForm = this._fb.group({
      poolControl: ['', [Validators.required]]
    });

    this.pools$ = this._liquidityPoolsService
      .getLiquidityPools(new LiquidityPoolsFilter({limit: 20, orderBy: LpOrderBy.Liquidity}))
      .pipe(map(pools => pools.results), tap(pools => this.pools = pools));

    this.filteredPools$ = this.poolControl.valueChanges
      .pipe(
        startWith(''),
        map((poolAddress: string) => poolAddress ? this._filterPools(poolAddress) : this.pools.slice()));

    this.subscription.add(
      this._indexService.getLatestBlock$()
        .pipe(
          skip(1),
          filter(_ => !!this.pool),
          switchMap(_ => this._liquidityPoolsService.getLiquidityPool(this.pool.address)),
          tap(pool => this.pool = pool))
        .subscribe(_ => this.setRecords()));
  }

  ngOnChanges() {
    this.setRecords();
  }

  clearPool() {
    this.poolControl.setValue('');
    this.pool = null;
    this.setRecords();
  }

  selectPool($event: MatAutocompleteSelectedEvent) {
    this.pool = $event.option.value;
    this.onPoolChange.emit(this.pool);
    this.setRecords();
  }

  private setRecords() {
    if (!!this.pool === false) {
      this.poolPreviewRecords = [];
      return;
    };

    if (!!this.poolPreviewRecords?.length) {
      this.poolPreviewRecords = [];
    }

    if (this.showReserves) {
      // CRS
      this.poolPreviewRecords.push({
        token: this.pool.tokens.crs,
        supply: this.pool.summary.reserves.crs,
        percentageChange: this.pool.tokens.crs.summary.dailyPriceChangePercent,
        price: this.pool.tokens.crs.summary.priceUsd
      });

      // SRC
      this.poolPreviewRecords.push({
        token: this.pool.tokens.src,
        supply: this.pool.summary.reserves.src,
        percentageChange: this.pool.tokens.src.summary.dailyPriceChangePercent,
        price: this.pool.tokens.src.summary.priceUsd
      });

      // LP
      this.poolPreviewRecords.push({
        token: this.pool.tokens.lp,
        supply: this.pool.tokens.lp.totalSupply,
        percentageChange: this.pool.tokens.lp.summary.dailyPriceChangePercent,
        price: this.pool.tokens.lp.summary.priceUsd
      });
    }

    // Staking
    if (this.showStaking && !!this.pool.summary.staking) {
      this.poolPreviewRecords.push({
        token: this.pool.tokens.staking,
        supply: this.pool.summary.staking.weight,
        percentageChange: this.pool.tokens.staking.summary.dailyPriceChangePercent,
        price: this.pool.tokens.staking.summary.priceUsd
      });
    }

    // Mining
    if (this.showMining && !!this.pool.miningPool) {
      this.poolPreviewRecords.push({
        token: this.pool.tokens.staking,
        supply: this.pool.miningPool.tokensMining,
        percentageChange: this.pool.tokens.lp.summary.dailyPriceChangePercent,
        price: this.pool.tokens.lp.summary.priceUsd
      });
    }
  }

  private _filterPools(value: string): LiquidityPool[] {
    if (!value) [];

    const filterValue = value.toString().toLowerCase();

    return this.pools.filter(pool => {
      var addressMatch = pool.address.toLowerCase().includes(filterValue);
      var nameMatch = pool.name.toLowerCase().includes(filterValue);

      return addressMatch || nameMatch;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
