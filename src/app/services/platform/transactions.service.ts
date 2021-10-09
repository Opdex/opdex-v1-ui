import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { TransactionRequest } from '@sharedModels/requests/transactions-filter';
import { ITransactionReceipt, ITransactionReceipts } from '@sharedModels/responses/platform-api/transactions/transaction.interface';
import { Observable } from 'rxjs';
import { IAddressStaking, IAddressStakingPositions } from '@sharedModels/responses/platform-api/wallets/address-staking.interface';
import { IAddressMining, IAddressMiningPositions } from '@sharedModels/responses/platform-api/wallets/address-mining.interface';

@Injectable({ providedIn: 'root' })
export class TransactionsService extends CacheService {

  constructor(private _platformApi: PlatformApiService) {
    super();
  }

  getTransaction(hash: string): Observable<ITransactionReceipt> {
    return this.getItem(`Transaction-Request-${hash}`, this._platformApi.getTransaction(hash));
  }

  getTransactions(request: TransactionRequest): Observable<ITransactionReceipts> {
    return this.getItem(`Transactions-Request-${request.wallet}`, this._platformApi.getTransactions(request));
  }

  getStakingPosition(owner: string, liquidityPool: string): Observable<IAddressStaking> {
    return this.getItem(`Staking-Position-${owner}-${liquidityPool}`, this._platformApi.getStakingPosition(owner, liquidityPool));
  }

  getStakingPositions(owner: string, limit?: number, cursor?: string): Observable<IAddressStakingPositions> {
    return this.getItem(`Staking-Positions-${owner}-${limit}-${cursor}`, this._platformApi.getStakingPositions(owner, limit, cursor));
  }

  getMiningPosition(owner: string, miningPool: string): Observable<IAddressMining> {
    return this.getItem(`Mining-Position-${owner}-${miningPool}`, this._platformApi.getMiningPosition(owner, miningPool));
  }

  getMiningPositions(owner: string, limit?: number, cursor?: string): Observable<IAddressMiningPositions> {
    return this.getItem(`Mining-Positions-${owner}-${limit}-${cursor}`, this._platformApi.getMiningPositions(owner, limit, cursor));
  }
}
