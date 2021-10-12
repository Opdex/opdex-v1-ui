import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';
import { IAddressBalance, IAddressBalances } from '@sharedModels/platform-api/responses/wallets/address-balance.interface';
import { IAddressStaking, IAddressStakingPositions } from '@sharedModels/platform-api/responses/wallets/address-staking.interface';
import { IAddressMining, IAddressMiningPositions } from '@sharedModels/platform-api/responses/wallets/address-mining.interface';
import { BlocksService } from './blocks.service';

@Injectable({ providedIn: 'root' })
export class WalletsService extends CacheService {
  constructor(private _platformApi: PlatformApiService, protected _injector: Injector) {
    super(_injector);
  }

  getBalance(wallet: string, token: string): Observable<IAddressBalance> {
    return this.getItem(`wallet-balance-${wallet}-${token}`, this._platformApi.getBalance(wallet, token));
  }

  refreshBalance(wallet: string, token: string): void {
    this.refreshItem(`wallet-balance-${wallet}-${token}`);
  }

  getWalletBalances(wallet: string, limit?: number, cursor?: string): Observable<IAddressBalances> {
    return this.getItem(`wallet-balances-${wallet}-${limit}-${cursor}`, this._platformApi.getWalletBalances(wallet, limit, cursor));
  }

  refreshBalances(wallet: string, limit?: number, cursor?: string): void {
    this.refreshItem(`wallet-balances-${wallet}-${limit}-${cursor}`);
  }

  getStakingPosition(wallet: string, liquidityPool: string): Observable<IAddressStaking> {
    return this.getItem(`staking-position-${wallet}-${liquidityPool}`, this._platformApi.getStakingPosition(wallet, liquidityPool));
  }

  refreshStakingPosition(wallet: string, liquidityPool: string): void {
    this.refreshItem(`staking-position-${wallet}-${liquidityPool}`);
  }

  getStakingPositions(wallet: string, limit?: number, cursor?: string): Observable<IAddressStakingPositions> {
    return this.getItem(`staking-positions-${wallet}-${limit}-${cursor}`, this._platformApi.getStakingPositions(wallet, limit, cursor));
  }

  refreshStakingPositions(wallet: string, limit?: number, cursor?: string): void {
    this.refreshItem(`staking-positions-${wallet}-${limit}-${cursor}`);
  }

  getMiningPosition(wallet: string, miningPool: string): Observable<IAddressMining> {
    return this.getItem(`mining-position-${wallet}-${miningPool}`, this._platformApi.getMiningPosition(wallet, miningPool));
  }

  refreshMiningPosition(wallet: string, miningPool: string): void {
    this.refreshItem(`mining-position-${wallet}-${miningPool}`);
  }

  getMiningPositions(wallet: string, limit?: number, cursor?: string): Observable<IAddressMiningPositions> {
    return this.getItem(`mining-positions-${wallet}-${limit}-${cursor}`, this._platformApi.getMiningPositions(wallet, limit, cursor));
  }

  refreshMiningPositions(wallet: string, limit?: number, cursor?: string): void {
    this.refreshItem(`mining-positions-${wallet}-${limit}-${cursor}`);
  }
}
