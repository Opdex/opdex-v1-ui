import { MatDialog } from "@angular/material/dialog";
import { SignTxModalComponent } from "@sharedComponents/modals-module/sign-tx-modal/sign-tx-modal.component";

export abstract class TxBase {
  constructor(protected _dialog: MatDialog) {}

  signTx(): void {
    this._dialog.open(SignTxModalComponent, {
      width: '600px',
      position: { top: '200px' },
      data:  {},
      panelClass: ''
    });
  }
}
