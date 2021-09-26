import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Input, OnChanges } from '@angular/core';
import { ITransactionsRequest, TransactionRequest } from '@sharedModels/requests/transactions-filter';
import { ITransactionReceipt, ITransactionReceipts } from '@sharedModels/responses/platform-api/transactions/transaction.interface';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { ITransferEvent } from '@sharedModels/responses/platform-api/transactions/transaction-events/tokens/transfer-event.interface';

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
  transactions$: Observable<ITransactionReceipt[]>;
  iconSizes = IconSizes;

  constructor(private _platformApi: PlatformApiService) { }

  ngOnChanges(): void {
    if (this.transactionRequest && !this.transactions$) {
      this.transactions$ = this.getTransactions();
    }
  }

  getTransactions(): Observable<ITransactionReceipt[]> {
    return this._platformApi.getTransactions(new TransactionRequest(this.transactionRequest))
      .pipe(
        take(1),
        // Filter transactions
        map((transactionsResponse: ITransactionReceipts) => {
          let filteredTransactions = transactionsResponse.results;

          filteredTransactions
            .map(transaction => {

              // Filter event types if provided
              if (this.transactionRequest.eventTypes?.length) {
                transaction.events = transaction.events.filter(event => this.transactionRequest.eventTypes.includes(event.eventType));
              }

              // If the wallet is specified, hide transfer events in the transaction that do not involve the wallet address (e.g. contract to contract transfers)
              const wallet = this.transactionRequest.wallet;
              if (wallet?.length > 0) {
                transaction.events = transaction.events.filter(event => {
                  if (event.eventType === 'TransferEvent') {
                    const transferEvent = <ITransferEvent>event;
                    return transferEvent.from === wallet || transferEvent.to === wallet;
                  }

                  return true;
                });
              }

              return transaction;
            });

          // Only transactions that have events
          transactionsResponse.results = filteredTransactions.filter(tx => tx.events.length >= 1);

          // Set next/previous pages
          this.transactionRequest.next = transactionsResponse.paging.next;
          this.transactionRequest.previous = transactionsResponse.paging.previous;

          return transactionsResponse.results;
        }),
        // Reorder tx and tx events final results
        map((transactions: ITransactionReceipt[]) => {
          return transactions;
        })
      );
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
