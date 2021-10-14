import { MathService } from '@sharedServices/utility/math.service';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Icons } from 'src/app/enums/icons';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { Subscription } from 'rxjs';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

@Component({
  selector: 'opdex-tx-stake-stop',
  templateUrl: './tx-stake-stop.component.html',
  styleUrls: ['./tx-stake-stop.component.scss']
})
export class TxStakeStopComponent extends TxBase implements OnChanges {
  @Input() data;
  icons = Icons;
  form: FormGroup;
  pool: ILiquidityPoolSummary;
  subscription = new Subscription();
  fiatValue: string;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get liquidate(): FormControl {
    return this.form.get('liquidate') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _injector: Injector,
    private _platformApi: PlatformApiService,
  ) {
    super(_injector);

    this.form = this._fb.group({
      amount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      liquidate: [false]
    });

    this.subscription.add(
      this.amount.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged())
        .subscribe(amount => {
          const stakingTokenFiat = new FixedDecimal(this.pool.token.staking.summary.price.close.toString(), 8);
          const amountDecimal = new FixedDecimal(amount, this.pool.token.staking.decimals);
          this.fiatValue = MathService.multiply(amountDecimal, stakingTokenFiat);
        }));
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  submit(): void {
    let amount = this.amount.value.toString().replace(/,/g, '');
    if (!amount.includes('.')) amount = `${amount}.00`;

    const payload = {
      amount: amount,
      liquidate: this.liquidate.value
    }

    this._platformApi
      .stopStakingQuote(this.pool.address, payload)
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
