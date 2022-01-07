import { IAddressAllowanceResponse } from '@sharedModels/platform-api/responses/wallets/address-allowance.interface';
import { MiningPositionsFilter } from '@sharedModels/platform-api/requests/wallets/mining-positions-filter';
import { StakingPositionsFilter } from '@sharedModels/platform-api/requests/wallets/staking-positions-filter';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { IAddressBalance, IAddressBalances } from '@sharedModels/platform-api/responses/wallets/address-balance.interface';
import { IAddressStaking, IAddressStakingPositions } from '@sharedModels/platform-api/responses/wallets/address-staking.interface';
import { IAddressMining, IAddressMiningPositions } from '@sharedModels/platform-api/responses/wallets/address-mining.interface';
import { WalletBalancesFilter } from '@sharedModels/platform-api/requests/wallets/wallet-balances-filter';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WalletsService extends CacheService {
  constructor(private _platformApi: PlatformApiService, protected _injector: Injector) {
    super(_injector);
  }

  getAllowance(wallet: string, spender: string, token: string): Observable<IAddressAllowanceResponse> {
    return this.getItem(`wallet-allowance-${wallet}-${spender}-${token}`, this._platformApi.getAllowance(wallet, spender, token));
  }

  getBalance(wallet: string, token: string): Observable<IAddressBalance> {
    return this.getItem(`wallet-balance-${wallet}-${token}`, this._platformApi.getBalance(wallet, token));
  }

  getWalletBalances(wallet: string, request: WalletBalancesFilter): Observable<IAddressBalances> {
    return this.getItem(`wallet-balances-${wallet}-${request.buildQueryString()}`, this._platformApi.getWalletBalances(wallet, request))
      .pipe(tap(balances => balances.results.forEach(balance => this.cacheItem(`wallet-balance-${wallet}-${balance.token}`, balance))));
  }

  getStakingPosition(wallet: string, liquidityPool: string): Observable<IAddressStaking> {
    return this.getItem(`staking-position-${wallet}-${liquidityPool}`, this._platformApi.getStakingPosition(wallet, liquidityPool));
  }

  getStakingPositions(wallet: string, request: StakingPositionsFilter): Observable<IAddressStakingPositions> {
    return this.getItem(`staking-positions-${wallet}-${request.buildQueryString()}`, this._platformApi.getStakingPositions(wallet, request))
      .pipe(tap(stakingPositions => stakingPositions.results.forEach(stakingPosition => this.cacheItem(`staking-position-${wallet}-${stakingPosition.liquidityPool}`, stakingPosition))));
  }

  getMiningPosition(wallet: string, miningPool: string): Observable<IAddressMining> {
    return this.getItem(`mining-position-${wallet}-${miningPool}`, this._platformApi.getMiningPosition(wallet, miningPool));
  }

  getMiningPositions(wallet: string, request: MiningPositionsFilter): Observable<IAddressMiningPositions> {
    return this.getItem(`mining-positions-${wallet}-${request.buildQueryString()}`, this._platformApi.getMiningPositions(wallet, request))
      .pipe(tap(positions => positions.results.forEach(position => this.cacheItem(`mining-position-${wallet}-${position.miningPool}`, position))));
  }
}
