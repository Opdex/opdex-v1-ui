import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IndexService } from '@sharedServices/platform/index.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionView } from '@sharedModels/transaction-view';
import { Component, EventEmitter, Input, Output, OnDestroy, OnChanges } from '@angular/core';
import { map, startWith, tap, skip, filter, switchMap } from 'rxjs/operators';
import { LiquidityPoolsFilter, LpOrderBy } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Icons } from 'src/app/enums/icons';

interface IPoolPreviewRecord {
  token: IToken;
  supply: string;
  percentageChange: number;
  price: number;
}

@Component({
  selector: 'opdex-pool-preview',
  templateUrl: './pool-preview.component.html',
  styleUrls: ['./pool-preview.component.scss']
})
export class PoolPreviewComponent implements OnChanges, OnDestroy {
  @Input() pool: ILiquidityPoolResponse;
  @Input() view: TransactionView;
  poolForm: FormGroup;
  pools: ILiquidityPoolResponse[];
  filteredPools$: Observable<ILiquidityPoolResponse[]>;
  pools$: Observable<ILiquidityPoolResponse[]>;
  iconSizes = IconSizes;
  icons = Icons;
  subscription = new Subscription();
  poolPreviewRecords: IPoolPreviewRecord[] = [];

  @Output() onPoolChange: EventEmitter<ILiquidityPoolResponse> = new EventEmitter();

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
        token: this.pool.token.crs,
        supply: this.pool.summary.reserves.crs,
        percentageChange: this.pool.token.crs.summary.dailyPriceChangePercent,
        price: this.pool.token.crs.summary.priceUsd
      });

      // SRC
      this.poolPreviewRecords.push({
        token: this.pool.token.src,
        supply: this.pool.summary.reserves.src,
        percentageChange: this.pool.token.src.summary.dailyPriceChangePercent,
        price: this.pool.token.src.summary.priceUsd
      });

      // LP
      this.poolPreviewRecords.push({
        token: this.pool.token.lp,
        supply: this.pool.token.lp.totalSupply,
        percentageChange: this.pool.token.lp.summary.dailyPriceChangePercent,
        price: this.pool.token.lp.summary.priceUsd
      });
    }

    // Staking
    if (this.showStaking && !!this.pool.summary.staking) {
      this.poolPreviewRecords.push({
        token: this.pool.summary.staking.token,
        supply: this.pool.summary.staking.weight,
        percentageChange: this.pool.summary.staking.token.summary.dailyPriceChangePercent,
        price: this.pool.summary.staking.token.summary.priceUsd
      });
    }

    // Mining
    if (this.showMining && !!this.pool.summary.miningPool) {
      this.poolPreviewRecords.push({
        token: this.pool.summary.staking.token,
        supply: this.pool.summary.miningPool.tokensMining,
        percentageChange: this.pool.token.lp.summary.dailyPriceChangePercent,
        price: this.pool.token.lp.summary.priceUsd
      });
    }
  }

  private _filterPools(value: string): ILiquidityPoolResponse[] {
    if (!value) [];

    const filterValue = value.toString().toLowerCase();

    return this.pools.filter(pool => {
      var addressMatch = pool.address.toLowerCase().includes(filterValue);
      var symbolMatch = pool.token.src.symbol.toLowerCase().includes(filterValue);
      var nameMatch = pool.token.src.name.toLowerCase().includes(filterValue);

      return addressMatch || nameMatch || symbolMatch;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
