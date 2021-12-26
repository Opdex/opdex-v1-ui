import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';
import { IAddressBalance, IAddressBalances } from '@sharedModels/platform-api/responses/wallets/address-balance.interface';
import { IAddressStaking, IAddressStakingPositions } from '@sharedModels/platform-api/responses/wallets/address-staking.interface';
import { IAddressMining, IAddressMiningPositions } from '@sharedModels/platform-api/responses/wallets/address-mining.interface';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WalletsService extends CacheService {
  constructor(private _platformApi: PlatformApiService, protected _injector: Injector) {
    super(_injector);
  }

  getBalance(wallet: string, token: string): Observable<IAddressBalance> {
    return this.getItem(`wallet-balance-${wallet}-${token}`, this._platformApi.getBalance(wallet, token));
  }

  getWalletBalances(wallet: string, tokenType = 'All', limit?: number, cursor?: string): Observable<IAddressBalances> {
    return this.getItem(`wallet-balances-${wallet}-${tokenType}-${limit}-${cursor}`, this._platformApi.getWalletBalances(wallet, tokenType, limit, cursor))
      .pipe(tap(balances => balances.results.forEach(balance => this.cacheItem(`wallet-balance-${wallet}-${balance.token}`, balance))));
  }

  getStakingPosition(wallet: string, liquidityPool: string): Observable<IAddressStaking> {
    return this.getItem(`staking-position-${wallet}-${liquidityPool}`, this._platformApi.getStakingPosition(wallet, liquidityPool));
  }

  getStakingPositions(wallet: string, limit?: number, cursor?: string): Observable<IAddressStakingPositions> {
    return this.getItem(`staking-positions-${wallet}-${limit}-${cursor}`, this._platformApi.getStakingPositions(wallet, limit, cursor))
      .pipe(tap(stakingPositions => stakingPositions.results.forEach(stakingPosition => this.cacheItem(`staking-position-${wallet}-${stakingPosition.liquidityPool}`, stakingPosition))));
  }

  getMiningPosition(wallet: string, miningPool: string): Observable<IAddressMining> {
    return this.getItem(`mining-position-${wallet}-${miningPool}`, this._platformApi.getMiningPosition(wallet, miningPool));
  }

  getMiningPositions(wallet: string, limit?: number, cursor?: string): Observable<IAddressMiningPositions> {
    return this.getItem(`mining-positions-${wallet}-${limit}-${cursor}`, this._platformApi.getMiningPositions(wallet, limit, cursor))
      .pipe(tap(positions => positions.results.forEach(position => this.cacheItem(`mining-position-${wallet}-${position.miningPool}`, position))));
  }
}
