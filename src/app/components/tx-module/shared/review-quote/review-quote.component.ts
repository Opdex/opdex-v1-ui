import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { SignTxModalComponent } from '@sharedComponents/modals-module/sign-tx-modal/sign-tx-modal.component';
import { ITransactionQuoteResponse } from '@sharedModels/responses/platform-api/Transactions/transaction-quote-response';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'opdex-review-quote',
  templateUrl: './review-quote.component.html',
  styleUrls: ['./review-quote.component.scss']
})
export class ReviewQuoteComponent implements OnInit {
  agree = new FormControl(false);
  txHash: string;
  submitting = false;
  quote$: Observable<ITransactionQuoteResponse>;
  quote: ITransactionQuoteResponse;
  quoteRequest: any;

  public constructor(
    private _platformApi: PlatformApiService,
    public _bottomSheetRef: MatBottomSheetRef<SignTxModalComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any)
  {
    console.log(this.data)
  }

  ngOnInit() {
    if (this.data.transactionType === 'swap') {
      this.quote$ = this._platformApi.swap(this.data.payload);
    } else if (this.data.transactionType === 'add-liquidity') {
      this.quote$ = this._platformApi.addLiquidity(this.data.payload);
    } else if (this.data.transactionType === 'remove-liquidity') {
      this.quote$ = this._platformApi.removeLiquidity(this.data.payload);
    } else if (this.data.transactionType === 'start-staking') {
      this.quote$ = this._platformApi.startStaking(this.data.payload);
    } else if (this.data.transactionType === 'stop-staking') {
      this.quote$ = this._platformApi.stopStaking(this.data.payload);
    } else if (this.data.transactionType === 'collect-staking-rewards') {
      this.quote$ = this._platformApi.collectStakingRewards(this.data.payload);
    } else if (this.data.transactionType === 'start-mining') {
      this.quote$ = this._platformApi.startMiningQuote(this.data.payload.miningPool, this.data.payload);
    } else if (this.data.transactionType === 'stop-mining') {
      this.quote$ = this._platformApi.stopMiningQuote(this.data.payload.miningPool, this.data.payload);
    } else if (this.data.transactionType === 'collect-mining-rewards') {
      this.quote$ = this._platformApi.collectMiningRewardsQuote(this.data.payload.miningPool);
    } else if (this.data.transactionType === 'approve') {
      this.quote$ = this._platformApi.approveAllowance(this.data.payload);
    }

    this.quote$
      .pipe(
        take(1),
        tap(q => this.quoteRequest = JSON.parse(atob(q.request))),
        tap(_ => this.quoteRequest.method = this.quoteRequest.method.replace(/([A-Z])/g, ' $1').trim())
      )
      .subscribe(rsp => this.quote = rsp);


  }

  public transactionLogsTrackBy(index: number, transactionLog: any) {
    return transactionLog.sortOrder;
  }

  submit() {
    this.submitting = true;

    this._platformApi.broadcastQuote({quote: this.quote.request})
      .pipe(take(1))
      .subscribe(response => {
        this.txHash = response.txHash;
        this.submitting = false;
      });
  }
}
