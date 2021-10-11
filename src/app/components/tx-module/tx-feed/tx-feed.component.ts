import { TransactionReceipt } from '@sharedModels/transaction';
import { Component, Input, OnChanges } from '@angular/core';
import { ITransactionsRequest, TransactionRequest } from '@sharedModels/platform-api/requests/transactions-filter';
import { ITransactionReceipts } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { TransactionsService } from '@sharedServices/platform/transactions.service';

@Component({
  selector: 'opdex-tx-feed',
  templateUrl: './tx-feed.component.html',
  styleUrls: ['./tx-feed.component.scss']
})
export class TxFeedComponent implements OnChanges {
  @Input() transactionRequest: ITransactionsRequest;
  @Input() size: 's' | 'm' | 'l';
  transactions: ITransactionReceipts;
  copied: boolean;
  transactions$: Observable<TransactionReceipt[]>;
  iconSizes = IconSizes;

  constructor(private _transactionsService: TransactionsService) { }

  ngOnChanges(): void {
    if (this.transactionRequest && !this.transactions$) {
      this.transactions$ = this.getTransactions();
    }
  }

  getTransactions(): Observable<TransactionReceipt[]> {
    return this._transactionsService.getTransactions(new TransactionRequest(this.transactionRequest))
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
          this.transactionRequest.next = transactionsResponse.paging.next;
          this.transactionRequest.previous = transactionsResponse.paging.previous;

          return receipts;
        })
      );
  }

  pageChange(cursor: string) {
    if (this.transactionRequest.next === cursor) {
      this.transactionRequest.previous = null;
    } else {
      this.transactionRequest.next = null;
    }

    this.transactions$ = this.getTransactions();
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
}
