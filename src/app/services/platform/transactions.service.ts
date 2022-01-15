import { NotificationService } from '@sharedServices/utility/notification.service';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { BehaviorSubject, Subject } from 'rxjs';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injectable, Injector } from '@angular/core';
import { CacheService } from '@sharedServices/utility/cache.service';
import { Observable } from 'rxjs';
import { ITransactionReceipt, ITransactionReceipts } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { TransactionRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';

@Injectable({ providedIn: 'root' })
export class TransactionsService extends CacheService {
  private broadcastTransactions: string[] = [];
  private broadcastedTransactions$ = new BehaviorSubject<string[]>([]);
  private broadcastedTransaction$ = new Subject<string>();
  private minedTransaction$ = new Subject<TransactionReceipt>();
  private quotingTransaction = false;

  constructor(
    private _platformApi: PlatformApiService,
    private _notificationsService: NotificationService,
    protected _injector: Injector
  ) {
    super(_injector);
  }

  setQuoteDrawerStatus(open: boolean): void {
    this.quotingTransaction = open;
  }

  // API Methods

  getTransaction(hash: string): Observable<ITransactionReceipt> {
    return this.getItem(hash, this._platformApi.getTransaction(hash));
  }

  getTransactions(request: TransactionRequest): Observable<ITransactionReceipts> {
    return this.getItem(`transactions-${request.buildQueryString()}`, this._platformApi.getTransactions(request));
  }

  // Service Observable Methods

  pushMinedTransaction(tx: TransactionReceipt): void {
    this.minedTransaction$.next(tx);

    // Remove broadcasted transaction
    const index = this.broadcastTransactions.indexOf(tx.hash);

    if (index > -1) {
      this.broadcastTransactions.splice(index, 1);
      this.broadcastedTransactions$.next(this.broadcastTransactions);
    }

    this._notificationsService.pushMinedTransactionNotification(tx);
  }

  pushBroadcastedTransaction(txHash: string): void {
    this.broadcastedTransaction$.next(txHash);

    if (!this.broadcastTransactions.includes(txHash)) {
      this.broadcastTransactions.push(txHash);
      this.broadcastedTransactions$.next(this.broadcastTransactions);
    }

    // Only notify the user if the quote drawer is closed, else it will show them in the receipt view
    if (!this.quotingTransaction) {
      this._notificationsService.pushBroadcastTransactionNotification(txHash);
    }
  }

  getMinedTransaction$(): Observable<TransactionReceipt> {
    return this.minedTransaction$.asObservable();
  }

  getBroadcastedTransaction$(): Observable<string> {
    return this.broadcastedTransaction$.asObservable();
  }

  getBroadcastedTransactions$(): Observable<string[]> {
    return this.broadcastedTransactions$.asObservable();
  }
}
