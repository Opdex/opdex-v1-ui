import { ITransactionReceipts } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { TransactionsService } from '@sharedServices/platform/transactions.service';
import { Component, OnChanges, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { ITransactionsRequest, TransactionRequest } from '@sharedModels/platform-api/requests/transactions/transactions-filter';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { BlocksService } from '@sharedServices/platform/blocks.service';
import { Icons } from 'src/app/enums/icons';

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
  iconSizes = IconSizes;
  icons = Icons;
  nextPage: string = null;
  cursor: string;
  subscription: Subscription = new Subscription();
  transactions: TransactionReceipt[] = [];
  newTransactions: TransactionReceipt[] = [];
  refreshAvailable: boolean;
  loading = true;
  endReached: boolean;

  constructor(
    private _transactionsService: TransactionsService,
    private _blocksService: BlocksService) { }

  ngOnChanges(): void {
    if (this.transactionRequest) {

      // Todo: Improve this, when on a view who's route changes but the view component doesn't,
      // we need to unsubscribe and clear the current feed, then refresh all based on the new view
      this.subscription.unsubscribe();
      this.subscription = new Subscription();
      this.transactions = [];
      this.newTransactions = [];
      this.loading = true;

      if (this.feedContainer) {
        this.feedContainer.nativeElement.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }

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

  onScroll() {
    this.more();
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
            if (!transactionsResponse.paging.next) {
              this.endReached = true;
            } else {
              this.nextPage = transactionsResponse.paging.next;
            }
          }

          return receipts;
        })
      );
  }

  more() {
    if (this.endReached) return;

    this.transactionRequest.cursor = this.nextPage;
    this.getTransactions(this.transactionRequest)
      .pipe(take(1))
      .subscribe((transactions: TransactionReceipt[]) => this.transactions.push(...transactions));
  }

  toggleRefresh() {
    this.refreshAvailable = !this.refreshAvailable;
  }

  public transactionsTrackBy(index: number, transaction: any) {
    return transaction.hash;
  }

  public transactionLogsTrackBy(index: number, transactionLog: any) {
    return `${index}-${transactionLog.sortOrder}`;
  }

  copyHandler($event) {
    this.copied = true;
    setTimeout(() => this.copied = false, 1000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
