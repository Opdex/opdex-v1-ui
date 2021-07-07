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
      console.log(this.data)
    }

  submit() {
    this.submitting = true;
    let transaction$: Observable<any>;

    if (this.data.transactionType === 'swap') {
      transaction$ = this._platformApi.swap(this.data.payload);
    } else if (this.data.transactionType === 'add-liquidity') {
      transaction$ = this._platformApi.addLiquidity(this.data.payload);
    } else if (this.data.transactionType === 'remove-liquidity') {
      transaction$ = this._platformApi.removeLiquidity(this.data.payload);
    } else if (this.data.transactionType === 'start-staking') {
      transaction$ = this._platformApi.startStaking(this.data.payload);
    } else if (this.data.transactionType === 'stop-staking') {
      transaction$ = this._platformApi.stopStaking(this.data.payload);
    } else if (this.data.transactionType === 'collect-staking-rewards') {
      transaction$ = this._platformApi.collectStakingRewards(this.data.payload);
    } else if (this.data.transactionType === 'start-mining') {
      transaction$ = this._platformApi.startMining(this.data.payload);
    } else if (this.data.transactionType === 'stop-mining') {
      transaction$ = this._platformApi.stopMining(this.data.payload);
    } else if (this.data.transactionType === 'collect-mining-rewards') {
      transaction$ = this._platformApi.collectMiningRewards(this.data.payload);
    } else if (this.data.transactionType === 'approve') {
      transaction$ = this._platformApi.approveAllowance(this.data.payload);
    }

    transaction$
      .pipe(take(1))
      .subscribe(response => {
        this.txHash = response.txHash;
        this.submitting = false;
      });
  }
}
