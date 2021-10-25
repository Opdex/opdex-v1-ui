import { ThemeService } from '@sharedServices/utility/theme.service';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { MathService } from '@sharedServices/utility/math.service';
import { IAddressBalance } from '@sharedModels/platform-api/responses/wallets/address-balance.interface';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { IAddressMining } from '@sharedModels/platform-api/responses/wallets/address-mining.interface';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { ITransactionsRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IAddressStaking } from '@sharedModels/platform-api/responses/wallets/address-staking.interface';
import { WalletsService } from '@sharedServices/platform/wallets.service';

@Component({
  selector: 'opdex-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  transactionsRequest: ITransactionsRequest;
  walletBalances: any;
  miningPositions: any;
  stakingPositions: any;
  wallet: any;
  crsBalance: IAddressBalance;
  crsBalanceValue: string;
  showPreferences: boolean;
  block = 1;

  constructor(
    private _context: UserContextService,
    private _platform: PlatformApiService,
    private _tokensService: TokensService,
    private _liquidityPoolService: LiquidityPoolsService,
    private _walletsService: WalletsService,
    private _router: Router,
    private _theme: ThemeService
  ) {
    this.wallet = this._context.getUserContext();
    this.getWalletBalances(10);
    this.getMiningPositions(10);
    this.getStakingPositions(10);

    this._walletsService.getBalance(this.wallet.wallet, 'CRS')
      .pipe(
        tap(crsBalance => this.crsBalance = crsBalance),
        switchMap(crsBalance => this._tokensService.getToken(crsBalance.token)),
        tap((token: IToken) => {
          const costFixed = new FixedDecimal(token.summary.priceUsd.toString(), 8);
          const crsBalanceFixed = new FixedDecimal(this.crsBalance.balance, 8);
          this.crsBalanceValue = MathService.multiply(crsBalanceFixed, costFixed);
        }),
        take(1)).subscribe();
  }

  handleDeadlineChange(threshold: number) {
    this.wallet.preferences.deadlineThreshold = threshold;
    this._context.setUserPreferences(this.wallet.wallet, this.wallet.preferences);
  }

  handleToleranceChange(threshold: number) {
    this.wallet.preferences.toleranceThreshold = threshold;
    this._context.setUserPreferences(this.wallet.wallet, this.wallet.preferences);
  }

  toggleTheme(theme: string) {
    this.wallet.preferences.theme = theme;
    this._context.setUserPreferences(this.wallet.wallet, this.wallet.preferences);
    this._theme.setTheme(theme);
  }

  togglePreferences() {
    this.showPreferences = !this.showPreferences;
  }

  handleBalancesPageChange(cursor: string) {
    this.getWalletBalances(null, cursor);
  }

  handleMiningPositionsPageChange(cursor: string) {
    this.getMiningPositions(null, cursor);
  }

  handleStakingPositionsPageChange(cursor: string) {
    this.getStakingPositions(null, cursor);
  }

  getMiningPositions(limit?: number, cursor?: string) {
    this._walletsService.getMiningPositions(this.wallet.wallet, limit, cursor)
      .pipe(
        switchMap(response => {
          const positions$: Observable<IAddressMining>[] = [];

          response.results.forEach(position => {
            const miningPositionDetails$: Observable<any> =
              this._liquidityPoolService.getLiquidityPool(position.miningToken)
                .pipe(
                  take(1),
                  map(pool => { return { pool, position }; }));

            positions$.push(miningPositionDetails$);
          })

          return forkJoin(positions$).pipe(map(positions => {
            return { paging: response.paging, positions }
          }));
        }),
        take(1)
      ).subscribe(response => this.miningPositions = response);
  }

  getStakingPositions(limit?: number, cursor?: string) {
    this._walletsService.getStakingPositions(this.wallet.wallet, limit, cursor)
      .pipe(
        switchMap(response => {
          const positions$: Observable<IAddressStaking>[] = [];

          response.results.forEach(position => {
            const stakingPositionDetails$: Observable<any> =
              this._liquidityPoolService.getLiquidityPool(position.liquidityPool)
                .pipe(
                  take(1),
                  map(pool => { return { pool, position }; }));

            positions$.push(stakingPositionDetails$);
          })

          return forkJoin(positions$).pipe(map(positions => {
            return { paging: response.paging, positions }
          }));
        }),
        take(1)
      ).subscribe(response => this.stakingPositions = response);
  }

  getWalletBalances(limit?: number, cursor?: string) {
    this._walletsService.getWalletBalances(this.wallet.wallet, limit, cursor)
      .pipe(
        switchMap(response => {
          const balances$: Observable<IToken>[] = [];

          response.results.forEach(balance => {
            const tokenDetails$: Observable<IToken> =
              this._tokensService.getToken(balance.token)
                .pipe(
                  take(1),
                  map(token => {
                    token.balance = balance;
                    return token;
                  })
                );

            balances$.push(tokenDetails$);
          })

          return forkJoin(balances$).pipe(map(balances => {
            return { paging: response.paging, balances }
          }));
        }),
        take(1)
      ).subscribe(response => this.walletBalances = response);
  }

  ngOnInit(): void {
    this.transactionsRequest = {
      limit: 15,
      direction: "DESC",
      eventTypes: [],
      wallet: this.wallet.wallet
    };
  }

  logout() {
    this._platform.auth(environment.marketAddress, null)
      .pipe(
        tap(token => this._context.setToken(token)),
        tap(_ => this._router.navigateByUrl('/')),
        take(1))
      .subscribe();
  }
}
