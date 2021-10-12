import { BlocksService } from '@sharedServices/platform/blocks.service';
import { tap } from 'rxjs/operators';
import { TransactionReceipt } from '@sharedModels/transaction';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ITransactionsRequest, TransactionRequest } from '@sharedModels/platform-api/requests/transactions-filter';
import { ITransactionReceipts } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { map, take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { TransactionsService } from '@sharedServices/platform/transactions.service';

@Component({
  selector: 'opdex-tx-feed',
  templateUrl: './tx-feed.component.html',
  styleUrls: ['./tx-feed.component.scss']
})
export class TxFeedComponent implements OnChanges, OnDestroy {
  @Input() transactionRequest: ITransactionsRequest;
  @Input() size: 's' | 'm' | 'l';
  transactions: ITransactionReceipts;
  copied: boolean;
  transactions$: Observable<TransactionReceipt[]>;
  iconSizes = IconSizes;
  nextPage: string;
  previousPage: string;
  subscription = new Subscription();

  constructor(private _transactionsService: TransactionsService, private _blocksService: BlocksService) { }

  ngOnChanges(): void {
    if (this.transactionRequest && !this.transactions$) {
      this.subscription.add(this._blocksService.getLatestBlock$().pipe(tap(_ => this.getTransactions())).subscribe());
    }
  }

  getTransactions(): void {
    this.transactions$ = this._transactionsService.getTransactions(new TransactionRequest(this.transactionRequest))
      .pipe(
        take(1),
        // Filter transactions
        map((transactionsResponse: ITransactionReceipts) => {
          let filteredTransactions = transactionsResponse.results;

          // map to transaction receipt
          var receipts = filteredTransactions
              .map(transaction => new TransactionReceipt(transaction))
              .filter(tx => tx.events.length >= 1);

          // Set next/previous pages
          this.nextPage = transactionsResponse.paging.next;
          this.previousPage = transactionsResponse.paging.previous;

          return receipts;
        })
      );
  }

  next() {
    this.transactionRequest.next = this.nextPage;
    this.transactionRequest.previous = null;
    console.log(this.transactionRequest)
    this.getTransactions();
  }

  previous() {
    this.transactionRequest.previous = this.previousPage;
    this.transactionRequest.next = null;
    this.getTransactions();
  }

  public transactionsTrackBy(index: number, transaction: any) {
    return transaction.hash;
  }

  public transactionLogsTrackBy(index: number, transactionLog: any) {
    return transactionLog.sortOrder;
  }

  copyHandler($event) {
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 1000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
