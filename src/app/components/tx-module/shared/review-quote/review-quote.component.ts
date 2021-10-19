import { TransactionsService } from '@sharedServices/platform/transactions.service';
import { switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { SignTxModalComponent } from '@sharedComponents/modals-module/sign-tx-modal/sign-tx-modal.component';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Network } from 'src/app/enums/networks';
import { IQuoteReplayRequest, QuoteReplayRequest } from '@sharedModels/platform-api/requests/transactions/quote-replay-request';
import { TransactionBroadcastNotificationRequest } from '@sharedModels/platform-api/requests/transactions/transaction-broadcast-notification-request';

@Component({
  selector: 'opdex-review-quote',
  templateUrl: './review-quote.component.html',
  styleUrls: ['./review-quote.component.scss']
})
export class ReviewQuoteComponent implements OnInit {
  agree = new FormControl(false);
  txHash: string;
  submitting = false;
  quote$: Observable<ITransactionQuote>;
  quote: ITransactionQuote;
  quoteRequest: any;
  isDevnet: boolean;
  subscription = new Subscription();
  hideErrorsBug = false;

  public constructor(
    private _platformApi: PlatformApiService,
    public _bottomSheetRef: MatBottomSheetRef<SignTxModalComponent>,
    private _transactionsService: TransactionsService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ITransactionQuote
  ) {
    this._transactionsService.setQuoteDrawerStatus(true);
    this.subscription.add(
      this._transactionsService.getBroadcastedTransaction$()
        .subscribe(txHash => this.txHash = txHash));

    this.subscription.add(
      this._bottomSheetRef.backdropClick()
        .subscribe(_ => this._bottomSheetRef.dismiss(this.txHash)));
  }

  ngOnInit() {
    this.isDevnet = environment.network == Network.Devnet;
    this.setQuoteRequest(this.data.request);
    this.quote = this.data;

    const payload: IQuoteReplayRequest = new QuoteReplayRequest({quote: this.data.request});

    // Todo: Set on a timer.
    this.quote$ = this._platformApi.replayQuote(payload);

    this.quote$
      .pipe(
        take(1),
        tap(q => this.setQuoteRequest(q.request))
      ).subscribe(rsp => this.quote = rsp);
  }

  private setQuoteRequest(request: string) {
    const quoteRequest = JSON.parse(atob(request))

    // SFN bug showing errors incorrectly, hide them for all transactions where CRS are sent in
    this.hideErrorsBug = quoteRequest.method.includes('AddLiquidity') || quoteRequest.method.includes('Crs');

    // Changes method name to pascal case with spacing.
    quoteRequest.method = quoteRequest.method.replace(/([A-Z])/g, ' $1').trim();

    this.quoteRequest = quoteRequest;
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

  close() {
    this._bottomSheetRef.dismiss(this.txHash);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this._transactionsService.setQuoteDrawerStatus(false);
  }
}
