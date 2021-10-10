import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { TransactionRequest } from '@sharedModels/requests/transactions-filter';
import { ITransactionReceipt, ITransactionReceipts } from '@sharedModels/responses/platform-api/transactions/transaction.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionsService extends CacheService {

  constructor(private _platformApi: PlatformApiService) {
    super();
  }

  getTransaction(hash: string): Observable<ITransactionReceipt> {
    return this.getItem(`Transaction-Request-${hash}`, this._platformApi.getTransaction(hash));
  }

  getTransactions(request: TransactionRequest): Observable<ITransactionReceipts> {
    return this.getItem(`Transactions-Request-${request.buildQueryString}`, this._platformApi.getTransactions(request));
  }
}
