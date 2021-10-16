import { Icons } from 'src/app/enums/icons';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { ReviewQuoteComponent } from '../review-quote/review-quote.component';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { take, filter } from 'rxjs/operators';
import { ApproveAllowanceRequest, IApproveAllowanceRequest } from '@sharedModels/platform-api/requests/tokens/approve-allowance-request';

@Component({
  selector: 'opdex-allowance-validation',
  templateUrl: './allowance-validation.component.html',
  styleUrls: ['./allowance-validation.component.scss']
})
export class AllowanceValidationComponent implements OnChanges {
  @Input() allowance: AllowanceValidation;
  @Input() transactionType: AllowanceRequiredTransactionTypes;
  @Output() onAllowanceApproved: EventEmitter<string> = new EventEmitter();
  ignore: boolean = true;
  transactionTypes = AllowanceRequiredTransactionTypes;
  waiting: boolean;
  icons = Icons;

  constructor(
    private _bottomSheet: MatBottomSheet,
    private _platformApi: PlatformApiService) { }

  ngOnChanges() {
    if (this.allowance.isApproved) {
      this.waiting = false;
    }
  }

  approveAllowance(amount: string, spender: string, token: string) {
    const payload: IApproveAllowanceRequest = new ApproveAllowanceRequest(
      {
        amount: amount,
        spender: spender
      }
    )

    if(payload.isValid){
      this._platformApi
        .approveAllowanceQuote(token, payload)
          .pipe(take(1))
          .subscribe((quote: ITransactionQuote) => {
            this._bottomSheet.open(ReviewQuoteComponent, { data: quote })
              .afterDismissed()
              .pipe(take(1), filter(txhash => txhash !== null && txhash !== undefined))
              .subscribe(txhash => {
                this.waiting = true;
                this.onAllowanceApproved.emit(txhash);
              });
          });
    }
  }

  setIgnore(value: boolean) {
    this.ignore = value;
  }
}
