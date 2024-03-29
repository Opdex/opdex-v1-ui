import { IAddressBalance } from '@sharedModels/platform-api/responses/wallets/address-balance.interface';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Component, OnChanges, OnDestroy, ViewChild, Input, EventEmitter, Output } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { WalletBalancesFilter } from "@sharedModels/platform-api/requests/wallets/wallet-balances-filter";
import { ICursor } from "@sharedModels/platform-api/responses/cursor.interface";
import { TransactionView } from "@sharedModels/transaction-view";
import { FixedDecimal } from "@sharedModels/types/fixed-decimal";
import { IndexService } from "@sharedServices/platform/index.service";
import { WalletsService } from "@sharedServices/platform/wallets.service";
import { SidenavService } from "@sharedServices/utility/sidenav.service";
import { UserContextService } from "@sharedServices/utility/user-context.service";
import { Subscription, Observable, of, forkJoin, lastValueFrom } from "rxjs";
import { switchMap, take, map } from "rxjs/operators";
import { IconSizes } from "src/app/enums/icon-sizes";
import { Icons } from "src/app/enums/icons";

@Component({
  selector: 'opdex-wallet-provisioning-positions-table',
  templateUrl: './wallet-provisioning-positions-table.component.html',
  styleUrls: ['./wallet-provisioning-positions-table.component.scss']
})
export class WalletProvisioningPositionsTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: WalletBalancesFilter;
  @Output() onNumRecordsCount = new EventEmitter<string>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  subscription: Subscription;
  paging: ICursor;
  icons = Icons;
  iconSizes = IconSizes;
  loading = true;

  constructor(
    private _router: Router,
    private _sidebar: SidenavService,
    private _walletsService: WalletsService,
    private _liquidityPoolService: LiquidityPoolsService,
    private _indexService: IndexService,
    private _userContext: UserContextService,
    private _env: EnvironmentsService
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['pool', 'balance', 'total', 'valueCrs', 'valueSrc', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.loading = true;
      this.subscription = new Subscription();

      this.subscription.add(
        this._indexService.latestBlock$
          .pipe(switchMap(_ => this.getProvisionalPositions$(this.filter?.cursor)))
          .subscribe(_ => this.loading = false));
    }
  }

  openSidebar(child: string, poolAddress: string): void {
    this._liquidityPoolService.getLiquidityPool(poolAddress).pipe(take(1)).subscribe(pool => {
      this._sidebar.openSidenav(TransactionView.provide, { pool, child })
    });
  }

  pageChange(cursor: string) {
    this.getProvisionalPositions$(cursor).pipe(take(1)).subscribe();
  }

  navigate(name: string): void {
    this._router.navigateByUrl(`/pools/${name}`);
  }

  trackBy(index: number, position: any): string {
    return `${index}-${position.name}-${position.address}-${position.balance.formattedValue}-${position.total.formattedValue}`;
  }

  async refreshBalance(pool: string): Promise<void> {
    const {wallet} = this._userContext.userContext;

    this.dataSource.data = this.dataSource.data.map(item => {
      if (item.pool.address === pool) {
        item.refreshing = true;
      }

      return item;
    });

    await lastValueFrom(this._walletsService.refreshBalance(wallet, pool));
  }

  private getProvisionalPositions$(cursor?: string): Observable<any> {
    const context = this._userContext.userContext;
    if (!!context.wallet === false) return of(null);

    this.filter.cursor = cursor;

    return this._walletsService.getWalletBalances(context.wallet, this.filter)
      .pipe(
        switchMap(response => {
          this.onNumRecordsCount.emit(this._numRecords(response.paging, response.results));

          if (response.results.length === 0) {
            this.dataSource.data = [];
            return of(response);
          }

          const balances$: Observable<any>[] = [];

          response.results.forEach(balance => {
            const poolDetail$: Observable<any> =
              this._liquidityPoolService.getLiquidityPool(balance.token)
                .pipe(
                  take(1),
                  map(pool => {
                    return { pool, balance }
                  }));

            balances$.push(poolDetail$);
          })

          return forkJoin(balances$)
            .pipe(map(balances => {
              this.dataSource.data = balances.map(({pool, balance}) => this._buildRecord(pool, balance));

            this.paging = response.paging;
            return { paging: response.paging, results: balances };
          }));
        }));
  }

  private _buildRecord(pool: LiquidityPool, balance: IAddressBalance): any {
    const amount = new FixedDecimal(balance.balance, pool.tokens.lp.decimals);
    const valueCrs = amount.divide(pool.tokens.lp.totalSupply).multiply(pool.summary.reserves.crs);
    const valueSrc = amount.divide(pool.tokens.lp.totalSupply).multiply(pool.summary.reserves.src);

    return {
      pool,
      balance: amount,
      valueCrs: valueCrs,
      valueSrc: valueSrc,
      isCurrentMarket: pool.market === this._env.marketAddress,
      total: pool.tokens.lp.summary.priceUsd.multiply(amount)
    }
  }

  private _numRecords(paging: ICursor, records: any[]): string {
    return paging.next || paging.previous
      ? `${this.filter.limit}+`
      : records.length.toString();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
