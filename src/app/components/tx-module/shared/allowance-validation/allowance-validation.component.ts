import { IApprovalEvent } from '@sharedModels/platform-api/responses/transactions/transaction-events/tokens/approve-event.interface';
import { TransactionEventTypes } from 'src/app/enums/transaction-events';
import { Subscription } from 'rxjs';
import { TransactionsService } from '@sharedServices/platform/transactions.service';
import { Icons } from 'src/app/enums/icons';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { ReviewQuoteComponent } from '../review-quote/review-quote.component';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { take } from 'rxjs/operators';
import { ApproveAllowanceRequest } from '@sharedModels/platform-api/requests/tokens/approve-allowance-request';
import { IconSizes } from 'src/app/enums/icon-sizes';

@Component({
  selector: 'opdex-allowance-validation',
  templateUrl: './allowance-validation.component.html',
  styleUrls: ['./allowance-validation.component.scss']
})
export class AllowanceValidationComponent implements OnChanges, OnDestroy {
  @Input() allowance: AllowanceValidation;
  @Input() transactionType: AllowanceRequiredTransactionTypes;
  ignore: boolean = true;
  transactionTypes = AllowanceRequiredTransactionTypes;
  waiting: boolean;
  icons = Icons;
  iconSizes = IconSizes;
  subscription = new Subscription();

  constructor(
    private _bottomSheet: MatBottomSheet,
    private _platformApi: PlatformApiService,
    private _transactionsService: TransactionsService)
  {
    this.subscription.add(
      this._transactionsService.getBroadcastedTransaction$()
        .subscribe(tx => {
          if (this.allowance?.isApproved === false) this.waiting = true;
        }));

    this.subscription.add(this._transactionsService.getMinedTransaction$().subscribe(tx => {
      const allowanceEvents = tx.eventsOfType([TransactionEventTypes.ApprovalEvent]);
      const correctLength = allowanceEvents.length === 1;
      const firstEvent = allowanceEvents[0] as IApprovalEvent;
      const spendersMatch = firstEvent.spender === this.allowance.spender;

      if (this.allowance && correctLength && spendersMatch) {
        this.allowance.update(firstEvent);

        if (this.allowance.isApproved) this.waiting = false;
      }
    }));
  }

  ngOnChanges() {
    if (this.allowance.isApproved) this.waiting = false;
  }

  approveAllowance(amount: string, spender: string, token: string) {
    const payload = new ApproveAllowanceRequest({ amount: amount, spender: spender })

    if(payload.isValid) {

      this._platformApi.approveAllowanceQuote(token, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this.waiting = true;

          this._bottomSheet.open(ReviewQuoteComponent, { data: quote })
            .afterDismissed()
            .pipe(take(1))
            .subscribe((txHash: string) => {
              if (!txHash) this.waiting = false;
            });
        });
    }
  }

  setIgnore(value: boolean) {
    this.ignore = value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
