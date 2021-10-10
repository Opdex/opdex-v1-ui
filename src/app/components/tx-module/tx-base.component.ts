import { ReviewQuoteComponent } from './shared/review-quote/review-quote.component';
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { SignTxModalComponent } from "@sharedComponents/modals-module/sign-tx-modal/sign-tx-modal.component";
import { UserContextService } from "@sharedServices/utility/user-context.service";
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';

export abstract class TxBase {
  context: any;

  constructor(
    protected _userContext: UserContextService,
    protected _dialog: MatDialog,
    protected _bottomSheet: MatBottomSheet
  ) {
    this.context = _userContext.getUserContext();
  }

  signTx(payload: any, transactionType: string): void {
    this._dialog.open(SignTxModalComponent, {
      width: '600px',
      data:  {payload, transactionType},
      panelClass: ''
    });
  }

  quote(quote: ITransactionQuote) {
    this._bottomSheet.open(ReviewQuoteComponent, {
      data: quote
    });
  }
}
