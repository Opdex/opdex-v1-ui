import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';
import { IAddressBalance, IAddressBalances } from '@sharedModels/responses/platform-api/wallets/address-balance.interface';
import { IAddressStaking, IAddressStakingPositions } from '@sharedModels/responses/platform-api/wallets/address-staking.interface';
import { IAddressMining, IAddressMiningPositions } from '@sharedModels/responses/platform-api/wallets/address-mining.interface';

@Injectable({ providedIn: 'root' })
export class WalletsService extends CacheService {

  constructor(private _platformApi: PlatformApiService) {
    super();
  }

  getBalance(wallet: string, token: string): Observable<IAddressBalance> {
    return this.getItem(`Wallet-Balance-${wallet}-${token}`, this._platformApi.getBalance(wallet, token));
  }

  getWalletBalances(wallet: string, limit?: number, cursor?: string): Observable<IAddressBalances> {
    return this.getItem(`Wallet-Balances-${wallet}-${limit}-${cursor}`, this._platformApi.getWalletBalances(wallet, limit, cursor));
  }

  getStakingPosition(wallet: string, liquidityPool: string): Observable<IAddressStaking> {
    return this.getItem(`Staking-Position-${wallet}-${liquidityPool}`, this._platformApi.getStakingPosition(wallet, liquidityPool));
  }

  getStakingPositions(wallet: string, limit?: number, cursor?: string): Observable<IAddressStakingPositions> {
    return this.getItem(`Staking-Positions-${wallet}-${limit}-${cursor}`, this._platformApi.getStakingPositions(wallet, limit, cursor));
  }

  getMiningPosition(wallet: string, miningPool: string): Observable<IAddressMining> {
    return this.getItem(`Mining-Position-${wallet}-${miningPool}`, this._platformApi.getMiningPosition(wallet, miningPool));
  }

  getMiningPositions(wallet: string, limit?: number, cursor?: string): Observable<IAddressMiningPositions> {
    return this.getItem(`Mining-Positions-${wallet}-${limit}-${cursor}`, this._platformApi.getMiningPositions(wallet, limit, cursor));
  }
}
