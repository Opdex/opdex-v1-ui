import { take } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { tap } from 'rxjs/operators';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { ITransactionsRequest, TransactionRequest } from '@sharedModels/platform-api/requests/transactions-filter';
import { ITransactionReceipts } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { TransactionsService } from '@sharedServices/platform/transactions.service';

const placeholders = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10
];

@Component({
  selector: 'opdex-tx-feed',
  templateUrl: './tx-feed.component.html',
  styleUrls: ['./tx-feed.component.scss']
})
export class TxFeedComponent implements OnChanges, OnDestroy {
  @ViewChild('feedContainer') feedContainer: ElementRef;
  @Input() transactionRequest: ITransactionsRequest;
  @Input() size: 's' | 'm' | 'l';
  copied: boolean;
  transactions$: Observable<TransactionReceipt[]>;
  iconSizes = IconSizes;
  icons = Icons;
  nextPage: string = null;
  cursor: string;
  subscription = new Subscription();
  transactions: TransactionReceipt[] = [];
  newTransactions: TransactionReceipt[] = [];
  refreshAvailable: boolean;
  loading = true;
  placeholders: any[] = placeholders;

  constructor(
    private _transactionsService: TransactionsService,
    private _blocksService: BlocksService) { }

  ngOnChanges(): void {
    if (this.transactionRequest && !this.transactions$) {
      this.subscription.add(
        this._blocksService.getLatestBlock$()
          .pipe(
            tap(_ => this.transactionRequest.cursor = null), // reset the cursor
            switchMap(_ => this.getTransactions(this.transactionRequest)))
          .subscribe((transactions: TransactionReceipt[]) => {
            this.loading = false;
            if (this.transactions.length === 0) {
              this.transactions.push(...transactions);
              return;
            }

            // Filter and find NEW transactions against this.transactions
            // Filter and find NEW transactions against this.newTransactions
            var latestTransactions = transactions
              .filter(tx => this.transactions.find(existing => existing.hash === tx.hash) === undefined)
              .filter(tx => this.newTransactions.find(existing => existing.hash === tx.hash) === undefined);

            // add new transactions to the front of this.newTransactions
            if (latestTransactions.length > 0) {
              this.refreshAvailable = true;
              this.newTransactions.unshift(...latestTransactions);
            }
          }));
    }
  }

  refresh() {
    this.transactions.unshift(...this.newTransactions);
    this.newTransactions = [];
    this.feedContainer.nativeElement.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    this.refreshAvailable = false;
  }

  getTransactions(request: ITransactionsRequest): Observable<TransactionReceipt[]> {
    return this._transactionsService.getTransactions(new TransactionRequest(request))
      .pipe(
        // Filter transactions
        map((transactionsResponse: ITransactionReceipts) => {
          // map to transaction receipt
          var receipts = transactionsResponse.results
              .map(transaction => new TransactionReceipt(transaction))
              .filter(tx => tx.events.length >= 1);

          // Next page only set after we've gotten something. If not set - this is first load,
          // If cursor exists, this request is getting more txs
          // In either case, the very first load or load more set the next page cursor.
          // Refreshing latest shouldn't set nextPage. (e.g. 3 pages down, checking for new txs,
          // don't set next page but alert user to scroll up)
          if (!this.nextPage || request.cursor) {
            this.nextPage = transactionsResponse.paging.next;
          }

          return receipts;
        })
      );
  }

  more() {
    this.transactionRequest.cursor = this.nextPage;
    this.getTransactions(this.transactionRequest)
      .pipe(take(1))
      .subscribe((transactions: TransactionReceipt[]) => this.transactions.push(...transactions));
  }

  public transactionsTrackBy(index: number, transaction: any) {
    return transaction.hash;
  }

  public transactionLogsTrackBy(index: number, transactionLog: any) {
    return transactionLog.sortOrder;
  }

  copyHandler($event) {
    this.copied = true;
    setTimeout(() => this.copied = false, 1000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
