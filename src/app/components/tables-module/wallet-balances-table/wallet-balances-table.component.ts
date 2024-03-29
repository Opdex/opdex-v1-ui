import { AddressPosition } from '@sharedModels/address-position';
import { IAddressBalance } from '@sharedModels/platform-api/responses/wallets/address-balance.interface';
import { MarketToken } from '@sharedModels/ui/tokens/market-token';
import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { Component, Input, OnChanges, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { of, Observable, forkJoin, Subscription, lastValueFrom } from 'rxjs';
import { switchMap, catchError, take, map } from 'rxjs/operators';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { WalletBalancesFilter } from '@sharedModels/platform-api/requests/wallets/wallet-balances-filter';
import { LiquidityPoolsFilter, ILiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';

@Component({
  selector: 'opdex-wallet-balances-table',
  templateUrl: './wallet-balances-table.component.html',
  styleUrls: ['./wallet-balances-table.component.scss']
})
export class WalletBalancesTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: WalletBalancesFilter;
  @Output() onNumRecordsCount = new EventEmitter<string>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  subscription: Subscription;
  paging: ICursor;
  icons = Icons;
  iconSizes = IconSizes;
  transactionViews = TransactionView;
  loading = true;

  constructor(
    private _router: Router,
    private _sidebar: SidenavService,
    private _walletsService: WalletsService,
    private _tokensService: TokensService,
    private _indexService: IndexService,
    private _userContext: UserContextService,
    private _liquidityPoolService: LiquidityPoolsService,
    private _env: EnvironmentsService
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['token', 'name', 'balance', 'total', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      this.loading = true;
      this.subscription = new Subscription();

      this.subscription.add(
        this._indexService.latestBlock$
          .pipe(switchMap(_ => this.getWalletBalances$(this.filter?.cursor)))
          .subscribe(_ => this.loading = false));
    }
  }

  openSidebar(view: TransactionView, token: string): void {
    this.tryGetLiquidityPool(token).pipe(take(1)).subscribe(pool => {
      this._sidebar.openSidenav(view, { pool })
    });
  }

  private tryGetLiquidityPool(tokenAddress: string): Observable<LiquidityPool> {
    const filter = new LiquidityPoolsFilter({
      tokens: [tokenAddress],
      market: this._env.marketAddress,
      limit: 1
    } as ILiquidityPoolsFilter);

    return this._liquidityPoolService.getLiquidityPools(filter)
      .pipe(map(pools => pools?.results?.length ? pools.results[0] : null));
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/tokens/${name}`);
  }

  trackBy(index: number, position: any): string {
    return `${index}-${position.name}-${position.address}-${position.token.position.formattedValue}-${position.token.position.value}`;
  }

  pageChange(cursor: string): void {
    this.getWalletBalances$(cursor).pipe(take(1)).subscribe();
  }

  async refreshBalance(token: string): Promise<void> {
    const {wallet} = this._userContext.userContext;

    this.dataSource.data = this.dataSource.data.map(item => {
      if (item.token.address === token) {
        item.refreshing = true;
      }

      return item;
    });

    await lastValueFrom(this._walletsService.refreshBalance(wallet, token));
  }

  private getWalletBalances$(cursor?: string): Observable<any> {
    const context = this._userContext.userContext;
    if (!!context.wallet === false) return of(null);

    this.filter.cursor = cursor;

    return this._walletsService.getWalletBalances(context.wallet, this.filter)
      .pipe(
        switchMap(response => {
          this.onNumRecordsCount.emit(this._numRecords(response.paging, response.results))

          if (response.results.length === 0) {
            this.dataSource.data = [];
            return of(response);
          }

          const balances$: Observable<MarketToken>[] = [];

          response.results.forEach(balance => {
            const tokenDetails$: Observable<MarketToken> =
              this._tokensService.getMarketToken(balance.token)
                .pipe(
                  catchError(_ => this._tokensService.getToken(balance.token) as Observable<MarketToken>),
                  take(1),
                  map(token => {
                    const balanceFixed = new FixedDecimal(balance.balance, token.decimals);
                    const position = new AddressPosition(context.wallet, token, 'Balance', balanceFixed, balance.modifiedBlock);
                    token.setPosition(position);
                    return token;
                  })
                );

            balances$.push(tokenDetails$);
          });

          return forkJoin(balances$)
            .pipe(map(balances => {
              this.dataSource.data = balances.map(token => this._buildRecord(token));
              this.paging = response.paging;
              return { paging: response.paging, results: balances };
            }));
        }));
  }

  private _buildRecord(token: MarketToken, refreshing: boolean = false): any {
    return {
      refreshing,
      token,
      isCurrentMarket: token.market === this._env.marketAddress,
    }
  }

  private _numRecords(paging: ICursor, records: IAddressBalance[]): string {
    return paging.next || paging.previous ? `${this.filter.limit}+` : records.length.toString();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
