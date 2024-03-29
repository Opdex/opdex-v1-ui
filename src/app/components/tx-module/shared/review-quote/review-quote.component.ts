import { IndexService } from '@sharedServices/platform/index.service';
import { IBlock } from '@sharedModels/platform-api/responses/blocks/block.interface';
import { ITransactionReceipt } from '@sharedModels/platform-api/responses/transactions/transaction.interface';
import { TransactionReceipt } from '@sharedModels/ui/transactions/transaction-receipt';
import { TransactionsService } from '@sharedServices/platform/transactions.service';
import { filter, switchMap, skip } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Subscription } from 'rxjs';
import { TransactionQuoteRequest, ITransactionQuoteRequest } from '@sharedModels/platform-api/requests/transactions/transaction-quote-request';
import { Icons } from 'src/app/enums/icons';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { CollapseAnimation } from '@sharedServices/animations/collapse';

@Component({
  selector: 'opdex-review-quote',
  templateUrl: './review-quote.component.html',
  styleUrls: ['./review-quote.component.scss'],
  animations: [CollapseAnimation]
})
export class ReviewQuoteComponent implements OnDestroy {
  txHash: string;
  submitting = false;
  quote: ITransactionQuote;
  quoteRequest: ITransactionQuoteRequest;
  subscription = new Subscription();
  quoteReceipt: TransactionReceipt;
  showMethodDetails = true;
  showParameterDetails = true;
  latestBlock: IBlock;
  icons = Icons;
  iconSizes = IconSizes;
  showQrAnyways: boolean;

  methodParametersHelp = {
    title: 'What are method parameters?',
    paragraph: 'Method parameters are pieces of information that are given to the smart contract method so it has everything it needs to know in order to successfully execute the request.'
  }

  methodDetailsHelp = {
    title: 'What are method details?',
    paragraph: 'All Opdex transactions are executed by calling to a smart contract. Method details cover which smart contract to talk to and what functionality the user wants to execute.'
  }

  public constructor(
    private _platformApi: PlatformApiService,
    public _bottomSheetRef: MatBottomSheetRef<ReviewQuoteComponent>,
    private _transactionsService: TransactionsService,
    private _indexService: IndexService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ITransactionQuote
  ) {
    this.quote = this.data;
    this._transactionsService.setQuoteDrawerStatus(true);

    this.quoteRequest = this.data.request;
    this.setQuoteReceipt(this.data);

    this.subscription.add(
      this._transactionsService.getBroadcastedTransaction$()
        .subscribe(txHash => this.txHash = txHash));

    this.subscription.add(
      this._transactionsService.getMinedTransaction$()
        .subscribe(receipt => {
          if (this.txHash) return;

          const fromAddressMatches = receipt.from === this.quoteRequest.sender;
          const toAddressMatches = receipt.to === this.quoteRequest.to;
          let matchingEvents = true;

          for (var i = 0; i < receipt.events?.length || 0; i++) {
            matchingEvents = receipt.events[i].eventType === this.quote.events[i]?.eventType;
          }

          if (fromAddressMatches && toAddressMatches && matchingEvents) this.txHash = receipt.hash;
        }));

    this.subscription.add(
      this._bottomSheetRef.backdropClick()
        .subscribe(_ => this._bottomSheetRef.dismiss(this.txHash)));

    this.subscription.add(
      this._indexService.latestBlock$
        .pipe(
          skip(1),
          tap(block => this.latestBlock = block),
          filter(_ => !!this.txHash === false),
          switchMap(_ => this._platformApi.replayQuote(new TransactionQuoteRequest(this.data.request).payload)),
          tap(q => this.quoteRequest = q.request),
          tap(q => this.setQuoteReceipt(q)))
        .subscribe(rsp => this.quote = rsp)
    )
  }

  private setQuoteReceipt(quote: ITransactionQuote): void {
    this.quoteReceipt = new TransactionReceipt({
      hash: '',
      from: this.quoteRequest.sender,
      to: this.quoteRequest.to,
      gasUsed: quote.gasUsed,
      // Use the service for the first request when component loads, observable wouldn't have emitted yet
      block: this.latestBlock || this._indexService.latestBlock,
      success: !!quote.error === false,
      events: quote.events
    } as ITransactionReceipt);

    if (!this.quoteReceipt.success && !this.showQrAnyways) {
      this.showParameterDetails = false;
      this.showMethodDetails = false;
    }
  }

  public transactionLogsTrackBy(index: number, transactionLog: any) {
    return transactionLog.sortOrder;
  }

  toggleParameterDetails(): void {
    this.showParameterDetails = !this.showParameterDetails;
  }

  toggleMethodDetails(): void {
    this.showMethodDetails = !this.showMethodDetails;
  }

  close(): void {
    this._bottomSheetRef.dismiss(this.txHash);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this._transactionsService.setQuoteDrawerStatus(false);
  }
}
