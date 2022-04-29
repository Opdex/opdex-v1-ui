import { LiquidityPoolsFilter, ILiquidityPoolsFilter, LpOrderBy } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { LiquidityPool } from './../../../models/ui/liquidity-pools/liquidity-pool';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, switchMap, map, Observable, lastValueFrom } from 'rxjs';
import { Icons } from 'src/app/enums/icons';
import { LiquidityPools } from '@sharedModels/ui/liquidity-pools/liquidity-pools';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'opdex-liquidity-pool-keyword-filter-control',
  templateUrl: './liquidity-pool-keyword-filter-control.component.html',
  styleUrls: ['./liquidity-pool-keyword-filter-control.component.scss']
})
export class LiquidityPoolKeywordFilterControlComponent implements OnInit {
  @ViewChild('filterInput') filterInput: ElementRef;

  @Output() onPoolSelect = new EventEmitter<LiquidityPool>();

  control: FormControl;
  filter: LiquidityPoolsFilter;
  icons = Icons;
  subscription = new Subscription();
  liquidityPools: LiquidityPool[];

  constructor(private _liquidityPoolsService: LiquidityPoolsService) {
    this.liquidityPools = [null, null, null, null, null];
    this.control = new FormControl('');

    this.filter = new LiquidityPoolsFilter({
      orderBy: LpOrderBy.Volume,
      direction: 'DESC',
      limit: 10
    } as ILiquidityPoolsFilter);

    this.subscription.add(
      this.control.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(value => this.getLiquidityPools$(value)))
        .subscribe());
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => this.filterInput.nativeElement.focus());
    await lastValueFrom(this.getLiquidityPools$(null));
  }

  selectLiquidityPool(event$?: MatAutocompleteSelectedEvent): void {
    this.onPoolSelect.emit(event$?.option?.value);
  }

  getLiquidityPools$(keyword: string): Observable<void> {
    this.filter.keyword = keyword;

    return this._liquidityPoolsService.getLiquidityPools(this.filter)
      .pipe(map((response: LiquidityPools) => {
        this.liquidityPools = [...response.results];
      }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
