import { MatDialog } from "@angular/material/dialog";
import { SignTxModalComponent } from "@sharedComponents/modals-module/sign-tx-modal/sign-tx-modal.component";
import { UserContextService } from "@sharedServices/user-context.service";

export abstract class TxBase {
  context: any;

  constructor(
    protected _userContext: UserContextService,
    protected _dialog: MatDialog
  ) {
    this.context = _userContext.getUserContext();
  }

  signTx(payload: any, transactionType: string): void {
    this._dialog.open(SignTxModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  { payload, transactionType},
      panelClass: ''
    });
  }
}
