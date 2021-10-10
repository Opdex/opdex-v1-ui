import { FormControl } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'opdex-sign-tx-modal',
  templateUrl: './sign-tx-modal.component.html',
  styleUrls: ['./sign-tx-modal.component.scss']
})
export class SignTxModalComponent {
  agree = new FormControl(false);
  txHash: string;
  submitting = false;

  public constructor(
    private _platformApi: PlatformApiService,
    public dialogRef: MatDialogRef<SignTxModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  submit() {

  }
}
