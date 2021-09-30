import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ReviewQuoteComponent } from './../shared/review-quote/review-quote.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TransactionView } from '@sharedModels/transaction-view';
import { Icons } from 'src/app/enums/icons';
import { debounceTime } from 'rxjs/operators';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';

@Component({
  selector: 'opdex-tx-create-pool',
  templateUrl: './tx-create-pool.component.html',
  styleUrls: ['./tx-create-pool.component.scss']
})
export class TxCreatePoolComponent {
  @Input() data: any;
  view = TransactionView.createPool;
  form: FormGroup;
  icons = Icons;
  txHash: string;
  token$: Observable<string>;

  get token(): FormControl {
    return this.form.get('token') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platform: PlatformApiService,
    private _bottomSheet: MatBottomSheet
  ) {
    this.form = this._fb.group({
      token: ['', [Validators.required]]
    });

    this.token$ = this.token.valueChanges
      .pipe(
        debounceTime(300),
        tap((token: string) => {
          console.log(token);
          // todo: Should validate the token
        })
      );
  }

  submit() {
    const payload = {
      token: this.token.value
    }

    this._platform
      .createLiquidityPool(payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this._bottomSheet.open(ReviewQuoteComponent, {
            data: quote
          });
        });
  }
}