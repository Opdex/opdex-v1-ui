import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { MiningPoolsService } from '@sharedServices/platform/mining-pools.service';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { IndexService } from '@sharedServices/platform/index.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { combineLatest, Observable, of, Subscription, zip } from 'rxjs';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { AddressPosition } from '@sharedModels/address-position';
import { IAddressBalance } from '@sharedModels/platform-api/responses/wallets/address-balance.interface';
import { IAddressMining } from '@sharedModels/platform-api/responses/wallets/address-mining.interface';
import { IAddressStaking } from '@sharedModels/platform-api/responses/wallets/address-staking.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { catchError, map, skip, switchMap, take, tap } from 'rxjs/operators';
import { CollapseAnimation } from '@sharedServices/animations/collapse';
import { UserContext } from '@sharedModels/user-context';
import { IMiningPool } from '@sharedModels/platform-api/responses/mining-pools/mining-pool.interface';
import { Token } from '@sharedModels/ui/tokens/token';

@Component({
  selector: 'opdex-wallet-preview',
  templateUrl: './wallet-preview.component.html',
  styleUrls: ['./wallet-preview.component.scss'],
  animations: [CollapseAnimation]
})
export class WalletPreviewComponent implements OnDestroy {
  @Input() balanceTokens: string[] = [];
  @Input() positionMining: string[] = [];
  @Input() positionStaking: string[] = [];
  subscription = new Subscription();
  positions: any[];
  context: UserContext;
  icons = Icons;
  iconSizes = IconSizes;
  hide = false;

  constructor(
    private _userContext: UserContextService,
    private _walletService: WalletsService,
    private _tokenService: TokensService,
    private _liquidityPoolService: LiquidityPoolsService,
    private _indexService: IndexService,
    private _miningPoolService: MiningPoolsService
  ) {
    this.subscription.add(this._userContext.getUserContext$()
      .pipe(
        tap(context => this.context = context),
        switchMap(_ => this.getWalletSummary()))
      .subscribe());

    this.subscription.add(this._indexService.getLatestBlock$().pipe(skip(1), switchMap(_ => this.getWalletSummary())).subscribe());
  }

  ngOnChanges() {
    this.getWalletSummary().pipe(take(1)).subscribe();
  }

  toggleVisibility() {
    this.hide = !this.hide;
  }

  trackPosition(index: number, transactionLog: AddressPosition) {
    return `${index}-${transactionLog.position}-${transactionLog.token.address}-${transactionLog.value}`;
  }

  private getWalletSummary(): Observable<AddressPosition[]> {
    const wallet = this.context?.wallet;

    if (wallet) {
      const combo: Observable<AddressPosition>[] = [];

      this.balanceTokens.filter(a => a !== null && a !== undefined).forEach(token => combo.push(this.getTokenBalance(wallet, token)));
      this.positionStaking.filter(a => a !== null && a !== undefined).forEach(pool => combo.push(this.getStakingPosition(wallet, pool)));
      this.positionMining.filter(a => a !== null && a !== undefined).forEach(pool => combo.push(this.getMiningPosition(wallet, pool)));

      return zip(...combo).pipe(take(1), tap(results => this.positions = results.filter(result => result !== null)));
    }

    return of([]);
  }

  private getTokenBalance(walletAddress: string, tokenAddress: string): Observable<AddressPosition> {
    const combo = [
      this._tokenService.getMarketToken(tokenAddress),
      this._walletService.getBalance(walletAddress, tokenAddress).pipe(catchError(_ => of({ balance: '0' })))
    ];

    return combineLatest(combo)
      .pipe(
        map(([token, result]: [Token, IAddressBalance]) => {
          const amount = new FixedDecimal(result.balance, token.decimals);
          return new AddressPosition(walletAddress, token, 'Balance', amount);
        }),
        take(1));
  }

  private getStakingPosition(walletAddress: string, liquidityPoolAddress: string): Observable<AddressPosition> {
    const combo = [
      this._liquidityPoolService.getLiquidityPool(liquidityPoolAddress),
      this._walletService.getStakingPosition(walletAddress, liquidityPoolAddress).pipe(catchError(_ => of({ amount: '0' } as IAddressStaking)))
    ];

    return combineLatest(combo)
      .pipe(
        map(([liquidityPool, result]: [LiquidityPool, IAddressStaking]) => {
          // Governance token does not have staking, return null
          if (!liquidityPool.summary.staking) return null as AddressPosition;

          const amount = new FixedDecimal(result.amount, liquidityPool.summary.staking?.token.decimals);
          return new AddressPosition(walletAddress, liquidityPool.summary.staking?.token, 'Staking', amount);
        }),
        take(1));
  }

  private getMiningPosition(walletAddress: string, miningPoolAddress: string): Observable<AddressPosition> {
    const combo = [
      this._miningPoolService.getMiningPool(miningPoolAddress),
      this._walletService.getMiningPosition(walletAddress, miningPoolAddress).pipe(catchError(_ => of({ amount: '0' } as IAddressMining)))
    ];

    return combineLatest(combo)
      .pipe(
        switchMap(([miningPool, result]: [IMiningPool, IAddressMining]) => {
          return this._tokenService.getMarketToken(miningPool.liquidityPool)
            .pipe(map(token => {
              const amount = new FixedDecimal(result.amount, token.decimals);
              return new AddressPosition(walletAddress, token, 'Mining', amount);
            }));
        }),
        take(1));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
