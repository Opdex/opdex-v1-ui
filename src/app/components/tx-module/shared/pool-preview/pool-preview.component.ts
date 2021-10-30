import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionView } from '@sharedModels/transaction-view';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { map, startWith, tap } from 'rxjs/operators';
import { LiquidityPoolsFilter, LpOrderBy } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-pool-preview',
  templateUrl: './pool-preview.component.html',
  styleUrls: ['./pool-preview.component.scss']
})
export class PoolPreviewComponent {
  @Input() pool: ILiquidityPoolSummary;
  @Input() view: TransactionView;
  poolForm: FormGroup;
  pools: ILiquidityPoolSummary[];
  filteredPools$: Observable<ILiquidityPoolSummary[]>;
  pools$: Observable<ILiquidityPoolSummary[]>;
  iconSizes = IconSizes;
  icons = Icons;

  @Output() onPoolChange: EventEmitter<ILiquidityPoolSummary> = new EventEmitter();

  get poolControl(): FormControl {
    return this.poolForm.get('poolControl') as FormControl;
  }

  constructor(private _fb: FormBuilder, private _liquidityPoolsService: LiquidityPoolsService) {
    this.poolForm = this._fb.group({
      poolControl: ['', [Validators.required]]
    });

    this.pools$ = this._liquidityPoolsService
      .getLiquidityPools(new LiquidityPoolsFilter({limit: 20, orderBy: LpOrderBy.Liquidity}))
      .pipe(map(pools => pools.results), tap(pools => this.pools = pools));

    this.filteredPools$ = this.poolControl.valueChanges
      .pipe(
        startWith(''),
        map((poolAddress: string) => poolAddress ? this._filterPublicKeys(poolAddress) : this.pools.slice()));
  }

  private _filterPublicKeys(value: string): ILiquidityPoolSummary[] {
    if (!value) [];

    const filterValue = value.toString().toLowerCase();

    return this.pools.filter(pool => {
      var addressMatch = pool.address.toLowerCase().includes(filterValue);
      var symbolMatch = pool.token.src.symbol.toLowerCase().includes(filterValue);
      var nameMatch = pool.token.src.name.toLowerCase().includes(filterValue);

      return addressMatch || nameMatch || symbolMatch;
    });
  }


  get showStaking() {
    return this.view === TransactionView.stake;
  }

  get showMining() {
    return this.view === TransactionView.mine;
  }

  get showReserves() {
    return this.view === TransactionView.swap || this.view === TransactionView.provide;
  }

  clearPool() {
    this.poolControl.setValue('');
    this.pool = null;
  }

  selectPool($event: MatAutocompleteSelectedEvent) {
    this.pool = $event.option.value;
    this.onPoolChange.emit(this.pool);
  }
}
