import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { Component, Input, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TransactionView } from '@sharedModels/transaction-view';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { IMarketToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { of, Observable, forkJoin, Subscription } from 'rxjs';
import { switchMap, catchError, take, map } from 'rxjs/operators';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { WalletBalancesFilter } from '@sharedModels/platform-api/requests/wallets/wallet-balances-filter';
import { LiquidityPoolsFilter, ILiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';

@Component({
  selector: 'opdex-wallet-balances-table',
  templateUrl: './wallet-balances-table.component.html',
  styleUrls: ['./wallet-balances-table.component.scss']
})
export class WalletBalancesTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: WalletBalancesFilter;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  subscription: Subscription;
  paging: ICursor;
  icons = Icons;
  iconSizes = IconSizes;
  transactionViews = TransactionView;

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
      if (this.subscription && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }

      this.subscription = new Subscription();

      this.subscription.add(
        this._indexService.getLatestBlock$()
          .pipe(switchMap(_ => this.getWalletBalances$(this.filter?.cursor)))
          .subscribe());
    }
  }

  openSidebar(view: TransactionView, token: string): void {
    this.tryGetLiquidityPool(token).pipe(take(1)).subscribe(pool => {
      this._sidebar.openSidenav(view, { pool })
    });
  }

  private tryGetLiquidityPool(tokenAddress: string): Observable<ILiquidityPoolResponse> {
    const filter = new LiquidityPoolsFilter({
      tokens: [tokenAddress],
      market: this._env.marketAddress,
      limit: 1
    } as ILiquidityPoolsFilter);

    return this._liquidityPoolService.getLiquidityPools(filter)
      .pipe(map(pools => {
        const pool = pools?.results?.length ? pools.results[0] : null;
        return pool;
      }));
  }

  navigate(name: string) {
    this._router.navigateByUrl(`/tokens/${name}`);
  }

  trackBy(index: number, position: any): string {
    return `${index}-${position.name}-${position.address}-${position.balance}-${position.total}`;
  }

  pageChange(cursor: string): void {
    this.getWalletBalances$(cursor).pipe(take(1)).subscribe();
  }

  private getWalletBalances$(cursor?: string): Observable<any> {
    const context = this._userContext.getUserContext();
    if (!!context.wallet === false) return of(null);

    this.filter.cursor = cursor;

    return this._walletsService.getWalletBalances(context.wallet, this.filter)
      .pipe(
        switchMap(response => {
          if (response.results.length === 0) {
            this.dataSource.data = [];
            return of(response);
          }

          const balances$: Observable<IMarketToken>[] = [];

          response.results.forEach(balance => {
            const tokenDetails$: Observable<IMarketToken> =
              this._tokensService.getMarketToken(balance.token)
                .pipe(
                  // Fallback to tokens when necessary
                  // Todo: Backend really should return average token prices
                  catchError(_ => this._tokensService.getToken(balance.token)),
                  take(1),
                  map(token => {
                    token.balance = new FixedDecimal(balance.balance, token.decimals);
                    return token as IMarketToken;
                  })
                );

            balances$.push(tokenDetails$);
          })

          return forkJoin(balances$)
            .pipe(map(balances => {
              this.dataSource.data = balances.map(token => {
                const price = new FixedDecimal(token.summary?.priceUsd?.toString() || '0', 8);

                return {
                  token,
                  isCurrentMarket: token.market === this._env.marketAddress,
                  total: price.multiply(token.balance)
                }
              });

              this.paging = response.paging;
              return { paging: response.paging, results: balances };
            }));
        }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
