import { MathService } from '@sharedServices/utility/math.service';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { Injector, OnChanges, OnDestroy } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Icons } from 'src/app/enums/icons';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { Subscription } from 'rxjs';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IMiningQuote } from '@sharedModels/platform-api/requests/mining-pools/mining-quote';

@Component({
  selector: 'opdex-tx-mine-stop',
  templateUrl: './tx-mine-stop.component.html',
  styleUrls: ['./tx-mine-stop.component.scss']
})
export class TxMineStopComponent extends TxBase implements OnChanges, OnDestroy {
  @Input() data;
  icons = Icons;
  form: FormGroup;
  pool: ILiquidityPoolSummary;
  subscription = new Subscription();
  fiatValue: string;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    protected _injector: Injector,
  ) {
    super(_injector);

    this.form = this._fb.group({
      amount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]]
    });

    this.subscription.add(
      this.amount.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged())
        .subscribe(amount => {
          const lptFiat = new FixedDecimal(this.pool.token.lp.summary.priceUsd.toString(), 8);
          const amountDecimal = new FixedDecimal(amount, this.pool.token.lp.decimals);
          this.fiatValue = MathService.multiply(amountDecimal, lptFiat);
        }));
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  submit(): void {
    let amount = this.amount.value.toString().replace(/,/g, '');
    if (!amount.includes('.')) amount = `${amount}.00`;

    const payload: IMiningQuote = {
      amount: amount
    }

    this._platformApi
      .stopMiningQuote(this.pool.mining.address, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote));
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
    this.subscription.unsubscribe();
  }
}
