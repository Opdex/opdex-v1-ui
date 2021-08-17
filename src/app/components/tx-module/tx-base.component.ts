import { ReviewQuoteComponent } from './shared/review-quote/review-quote.component';
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { SignTxModalComponent } from "@sharedComponents/modals-module/sign-tx-modal/sign-tx-modal.component";
import { UserContextService } from "@sharedServices/utility/user-context.service";

export abstract class TxBase {
  context: any;

  constructor(
    protected _userContext: UserContextService,
    protected _dialog: MatDialog,
    protected _bottomSheet: MatBottomSheet
  ) {
    this.context = _userContext.getUserContext();
  }

  quoteTransaction(payload: any, transactionType: string): void {
    this._bottomSheet.open(ReviewQuoteComponent, {
      data: { payload, transactionType }
    });
  }

  signTx(payload: any, transactionType: string): void {
    this._dialog.open(SignTxModalComponent, {
      width: '600px',
      data:  {payload, transactionType},
      panelClass: ''
    });
  }
}
