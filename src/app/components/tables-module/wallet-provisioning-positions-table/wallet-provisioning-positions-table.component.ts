import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { Component, OnChanges, OnDestroy, ViewChild, Input } from "@angular/core";
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
import { Subscription, Observable, of, forkJoin } from "rxjs";
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
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  subscription: Subscription;
  paging: ICursor;
  icons = Icons;
  iconSizes = IconSizes;


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
    this.displayedColumns = ['pool', 'token', 'balance', 'total', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      if (this.subscription && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }

      this.subscription = new Subscription();

      this.subscription.add(
        this._indexService.getLatestBlock$()
          .pipe(switchMap(_ => this.getProvisionalPositions$(this.filter?.cursor)))
          .subscribe());
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

  private getProvisionalPositions$(cursor?: string): Observable<any> {
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
              this.dataSource.data = balances.map(({pool, balance}) => {
                const amount = new FixedDecimal(balance.balance, pool.tokens.src.decimals);

                return {
                  pool,
                  balance: amount,
                  isCurrentMarket: pool.market === this._env.marketAddress,
                  total: pool.tokens.src.summary.priceUsd.multiply(amount)
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
