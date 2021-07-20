import { ILiquidityPoolSummaryResponse } from './../../../models/responses/platform-api/Pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ITransactionsRequest, TransactionRequest } from '@sharedModels/requests/transactions-filter';
import { INominationEventResponse, ISwapEventResponse, ITransactionResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-response';
import { ITransactionsResponse } from '@sharedModels/responses/platform-api/Transactions/transactions-response';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { IToken } from '@sharedModels/responses/platform-api/token.interface';

@Component({
  selector: 'opdex-tx-feed',
  templateUrl: './tx-feed.component.html',
  styleUrls: ['./tx-feed.component.scss']
})
export class TxFeedComponent implements OnChanges {
  @Input() transactionRequest: ITransactionsRequest;
  @Input() size: 's' | 'm' | 'l' = 's';
  transactions: ITransactionsResponse;
  copied: boolean;
  transactions$: Observable<ITransactionResponse[]>;

  // Get transactions w/ filter
  // using filter, further unwanted events
  // Use cache/API request event meta data (token/pool details)
  // Combine/reorder events (enableMining/rewardMiningPool, srcToSrc, stopStake/collect/nomination, stopMine/collect)

  constructor(private _platformApi: PlatformApiService) { }

  ngOnChanges(): void {
    if (this.transactionRequest && !this.transactions$) {
      this.transactions$ = this.getTransactions();
    }
  }

  getTransactions(): Observable<ITransactionResponse[]> {
    return this._platformApi.getTransactions(new TransactionRequest(this.transactionRequest))
      .pipe(
        take(1),
        // Filter transactions
        map((transactionsResponse: ITransactionsResponse) => {
          let filteredTransactions = transactionsResponse.transactions;

          filteredTransactions
            .map(transaction => {

              if (this.transactionRequest.eventTypes?.length) {
                transaction.events = transaction.events.filter(event => this.transactionRequest.eventTypes.includes(event.eventType));
              }

                // We don't care of the log wasn't from our whitelist of contracts
                // .filter(log => this.transactionRequest.contracts.includes(log.contract))
                // Don't care if it's a nomination log for another liquidity pool
                // .filter(log => !(log.eventType === 'NominationEvent' && !this.transactionRequest.contracts.includes((<INominationEventResponse>log).stakingPool)))

              return transaction;
            });

          // Only transactions that have events
          transactionsResponse.transactions = filteredTransactions.filter(tx => tx.events.length >= 1);

          // Set next/previous pages
          this.transactionRequest.next = transactionsResponse.paging.next;
          this.transactionRequest.previous = transactionsResponse.paging.previous;

          return transactionsResponse.transactions;
        }),
        // Reorder tx and tx events final results
        map((transactions: ITransactionResponse[]) => {
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
