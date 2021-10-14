import { IconSizes } from './../../../../enums/icon-sizes';
import { Icons } from 'src/app/enums/icons';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { combineLatest, Observable, of, Subscription, zip } from 'rxjs';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { Component, Input, OnDestroy } from '@angular/core';
import { AddressPosition } from '@sharedModels/address-position';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IAddressBalance } from '@sharedModels/platform-api/responses/wallets/address-balance.interface';
import { IAddressMining } from '@sharedModels/platform-api/responses/wallets/address-mining.interface';
import { IAddressStaking } from '@sharedModels/platform-api/responses/wallets/address-staking.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';

@Component({
  selector: 'opdex-wallet-preview',
  templateUrl: './wallet-preview.component.html',
  styleUrls: ['./wallet-preview.component.scss']
})
export class WalletPreviewComponent implements OnDestroy {
  @Input() balanceTokens: string[] = [];
  @Input() positionMining: string[] = [];
  @Input() positionStaking: string[] = [];
  subscription = new Subscription();
  positions: any[];
  context: any;
  icons = Icons;
  iconSizes = IconSizes;
  hide = false;

  constructor(
    private _userContext: UserContextService,
    private _walletService: WalletsService,
    private _tokenService: TokensService,
    private _liquidityPoolService: LiquidityPoolsService,
    private _blocksService: BlocksService
  ) {
    this.subscription.add(this._userContext.getUserContext$().subscribe(context => this.context = context));
    this.subscription.add(this._blocksService.getLatestBlock$().pipe(switchMap(_ => this.getWalletSummary())).subscribe());
  }

  ngOnChanges() {
    this.getWalletSummary().pipe(take(1)).subscribe();
  }

  toggleVisibility() {
    this.hide = !this.hide;
  }

  public trackPosition(index: number, transactionLog: AddressPosition) {
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
      this._tokenService.getToken(tokenAddress),
      this._walletService.getBalance(walletAddress, tokenAddress).pipe(catchError(_ => of({ balance: '0' })))
    ];

    return combineLatest(combo)
      .pipe(
        map(([token, result]: [IToken, IAddressBalance]) => {
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
        map(([liquidityPool, result]: [ILiquidityPoolSummary, IAddressStaking]) => {
          // Governance token does not have staking, return null
          if (!liquidityPool.staking?.isActive) return null as AddressPosition;

          const amount = new FixedDecimal(result.amount, liquidityPool.token.staking.decimals);
          return new AddressPosition(walletAddress, liquidityPool.token.staking, 'Staking', amount);
        }),

        take(1));
  }

  private getMiningPosition(walletAddress: string, liquidityPoolAddress: string): Observable<AddressPosition> {
    const combo = [
      this._liquidityPoolService.getLiquidityPool(liquidityPoolAddress),
      this._walletService.getMiningPosition(walletAddress, liquidityPoolAddress).pipe(catchError(_ => of({ amount: '0' } as IAddressMining)))
    ];

    return combineLatest(combo)
      .pipe(
        map(([liquidityPool, result]: [ILiquidityPoolSummary, IAddressMining]) => {
          // Governance token does not have mining because it does not have staking, return null
          if (!liquidityPool.staking?.isActive) return null as AddressPosition;

          const amount = new FixedDecimal(result.amount, liquidityPool.token.lp.decimals);
          return new AddressPosition(walletAddress, liquidityPool.token.lp, 'Mining', amount);
        }),
        take(1));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
