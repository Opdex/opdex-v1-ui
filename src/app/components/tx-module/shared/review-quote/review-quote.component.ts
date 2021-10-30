import { BlocksService } from '@sharedServices/platform/blocks.service';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { ITransactionReceipt } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { TransactionReceipt } from '@sharedModels/transaction-receipt';
import { TransactionsService } from '@sharedServices/platform/transactions.service';
import { switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Network } from 'src/app/enums/networks';
import { IQuoteReplayRequest, QuoteReplayRequest } from '@sharedModels/platform-api/requests/transactions/quote-replay-request';
import { TransactionBroadcastNotificationRequest } from '@sharedModels/platform-api/requests/transactions/transaction-broadcast-notification-request';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';

@Component({
  selector: 'opdex-review-quote',
  templateUrl: './review-quote.component.html',
  styleUrls: ['./review-quote.component.scss']
})
export class ReviewQuoteComponent implements OnDestroy {
  txHash: string;
  submitting = false;
  quote: ITransactionQuote;
  quoteRequest: any;
  isDevnet: boolean;
  subscription = new Subscription();
  quoteReceipt: TransactionReceipt;
  showMethodDetails = true;
  showParameterDetails = true;
  latestBlock: IBlock;
  icons = Icons;
  iconSizes = IconSizes;

  methodParametersHelp = {
    title: 'What are method parameters?',
    paragraph: 'Method parameters are pieces of information that are given to the smart contract method so it has everything it needs to know in order to successfully execute the request.'
  }

  methodDetailsHelp = {
    title: 'What are method details?',
    paragraph: 'All Opdex transactions are executed by calling to a smart contract. Method details cover which smart contract to talk to and what functionality the user wants to execute.'
  }

  errorHelp = {
    title: 'Why do I have errors?',
    paragraph: 'Transaction quotes simply request what the outcome of a transaction would be at that point in time. Errors can occur for multiple reasons including invalid balances, token allowances, addresses or simply because the transaction request is not permitted due to smart contract logic.'
  }

  public constructor(
    private _platformApi: PlatformApiService,
    public _bottomSheetRef: MatBottomSheetRef<ReviewQuoteComponent>,
    private _transactionsService: TransactionsService,
    private _blocksService: BlocksService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ITransactionQuote
  ) {
    this.quote = this.data;
    this.isDevnet = environment.network == Network.Devnet;
    this._transactionsService.setQuoteDrawerStatus(true);

    this.setQuoteRequest(this.data.request);
    this.setQuoteReceipt(this.data);

    this.subscription.add(
      this._transactionsService.getBroadcastedTransaction$()
        .subscribe(txHash => this.txHash = txHash));

    this.subscription.add(
      this._bottomSheetRef.backdropClick()
        .subscribe(_ => this._bottomSheetRef.dismiss(this.txHash)));

    this.subscription.add(
      this._blocksService.getLatestBlock$()
        .pipe(
          tap(block => this.latestBlock = block),
          switchMap(_ => this._platformApi.replayQuote(new QuoteReplayRequest({quote: this.data.request}))),
          tap(q => this.setQuoteRequest(q.request)),
          tap(q => this.setQuoteReceipt(q)))
        .subscribe(rsp => this.quote = rsp)
    )
  }

  private setQuoteRequest(request: string) {
    this.quoteRequest = JSON.parse(atob(request));
  }

  private setQuoteReceipt(quote: ITransactionQuote): void {
    this.quoteReceipt = new TransactionReceipt({
      hash: '',
      from: this.quoteRequest.sender,
      to: this.quoteRequest.to,
      gasUsed: quote.gasUsed,
      // Use the service for the first request when component loads, observable wouldn't have emitted yet
      block: this.latestBlock || this._blocksService.getLatestBlock(),
      success: !quote.error,
      events: quote.events
    } as ITransactionReceipt);

    if (!this.quoteReceipt.success) {
      this.showParameterDetails = false;
      this.showMethodDetails = false;
    }
  }

  public transactionLogsTrackBy(index: number, transactionLog: any) {
    return transactionLog.sortOrder;
  }

  submit() {
    if (!this.isDevnet) {
      return;
    }

    this.submitting = true;
    const payload: IQuoteReplayRequest = new QuoteReplayRequest({quote: this.quote.request});
    this._platformApi.broadcastQuote(payload)
      .pipe(
        switchMap(response => {
          var request = new TransactionBroadcastNotificationRequest({walletAddress: this.quoteRequest.sender, transactionHash: response.txHash})
          return this._platformApi.notifyTransaction(request).pipe(take(1))
        }),
        take(1))
      .subscribe();
  }

  toggleParameterDetails(): void {
    this.showParameterDetails = !this.showParameterDetails;
  }

  toggleMethodDetails(): void {
    this.showMethodDetails = !this.showMethodDetails;
  }

  close() {
    this._bottomSheetRef.dismiss(this.txHash);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this._transactionsService.setQuoteDrawerStatus(false);
  }
}
