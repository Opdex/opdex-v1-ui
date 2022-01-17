import { OnDestroy } from '@angular/core';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MiningPositionsFilter } from '@sharedModels/platform-api/requests/wallets/mining-positions-filter';
import { ICursor } from '@sharedModels/platform-api/responses/cursor.interface';
import { IAddressMining } from '@sharedModels/platform-api/responses/wallets/address-mining.interface';
import { TransactionView } from '@sharedModels/transaction-view';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IndexService } from '@sharedServices/platform/index.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { MathService } from '@sharedServices/utility/math.service';
import { SidenavService } from '@sharedServices/utility/sidenav.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Subscription, of, Observable, forkJoin } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';

@Component({
  selector: 'opdex-wallet-mining-positions-table',
  templateUrl: './wallet-mining-positions-table.component.html',
  styleUrls: ['./wallet-mining-positions-table.component.scss']
})
export class WalletMiningPositionsTableComponent implements OnChanges, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @Input() filter: MiningPositionsFilter;
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
    private _userContext: UserContextService
  ) {
    this.dataSource = new MatTableDataSource<any>();
    this.displayedColumns = ['pool', 'status', 'position', 'value', 'actions'];
  }

  ngOnChanges() {
    if (this.filter && !this.subscription) {
      if (this.subscription && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }

      this.subscription = new Subscription();

      this.subscription.add(
        this._indexService.getLatestBlock$()
          .pipe(switchMap(_ => this.getMiningPositions$(this.filter?.cursor)))
          .subscribe());
    }
  }

  openSidebar(child: string, poolAddress: string): void {
    this._liquidityPoolService.getLiquidityPool(poolAddress).pipe(take(1)).subscribe(pool => {
      this._sidebar.openSidenav(TransactionView.mine, { pool, child })
    });
  }

  navigate(name: string): void {
    this._router.navigateByUrl(`/pools/${name}`);
  }

  trackBy(index: number, position: any): string {
    return `${index}-${position.name}-${position.address}-${position.balance}-${position.total}`;
  }

  pageChange(cursor: string): void {
    this.getMiningPositions$(cursor).pipe(take(1)).subscribe();
  }

  private getMiningPositions$(cursor?: string): Observable<any> {
    const context = this._userContext.getUserContext();
    if (!!context.wallet === false) return of(null);

    this.filter.cursor = cursor;

    return this._walletsService.getMiningPositions(context.wallet, this.filter)
      .pipe(
        switchMap(response => {
          if (response.results.length === 0) {
            this.dataSource.data = [];
            return of(response);
          }

          const positions$: Observable<IAddressMining>[] = [];

          response.results.forEach(position => {
            const miningPositionDetails$: Observable<any> =
              this._liquidityPoolService.getLiquidityPool(position.miningToken)
                .pipe(take(1), map(pool => { return { pool, position } }));

            positions$.push(miningPositionDetails$);
          })

          return forkJoin(positions$)
            .pipe(
              map(positions => {
                this.dataSource.data = positions.map((p: any) => {
                  return {
                    name: p.pool.name,
                    miningTokenSymbol: p.pool.token.lp.symbol,
                    liquidityPoolAddress: p.pool.address,
                    miningPoolAddress: p.position.miningPool,
                    position: p.position.amount,
                    isActive: p.pool.miningPool?.isActive === true,
                    decimals: p.pool.token.lp.decimals,
                    value: MathService.multiply(
                      new FixedDecimal(p.position.amount, p.pool.token.lp.decimals),
                      new FixedDecimal(p.pool.token.lp.summary.priceUsd.toString(), 8))
                  }
                });

                this.paging = response.paging;
              }));
        }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
