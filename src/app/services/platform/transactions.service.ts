import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';
import { ITransactionReceipt, ITransactionReceipts } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { TransactionRequest } from '@sharedModels/platform-api/requests/transactions-filter';

@Injectable({ providedIn: 'root' })
export class TransactionsService extends CacheService {

  constructor(private _platformApi: PlatformApiService, protected _injector: Injector) {
    super(_injector);
  }

  getTransaction(hash: string): Observable<ITransactionReceipt> {
    return this.getItem(`transaction-request-${hash}`, this._platformApi.getTransaction(hash), true);
  }

  refreshTransaction(hash: string): void {
    this.refreshItem(`transaction-request-${hash}`);
  }

  getTransactions(request: TransactionRequest): Observable<ITransactionReceipts> {
    const isHistorical = request.cursor?.length > 0;
    return this.getItem(`transactions-request-${request.buildQueryString()}`, this._platformApi.getTransactions(request), isHistorical);
  }

  refreshTransactions(request: TransactionRequest) {
    this.refreshItem(`transactions-request-${request.buildQueryString()}`);
  }
}
