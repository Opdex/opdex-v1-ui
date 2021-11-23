import { MathService } from '@sharedServices/utility/math.service';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { of, Subscription } from 'rxjs';
import { debounceTime, map, switchMap, take, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { IMiningQuote } from '@sharedModels/platform-api/requests/mining-pools/mining-quote';
import { BlocksService } from '@sharedServices/platform/blocks.service';

@Component({
  selector: 'opdex-tx-mine-start',
  templateUrl: './tx-mine-start.component.html',
  styleUrls: ['./tx-mine-start.component.scss']
})
export class TxMineStartComponent extends TxBase implements OnChanges {
  @Input() data;
  form: FormGroup;
  icons = Icons;
  pool: ILiquidityPoolResponse;
  allowance$ = new Subscription();
  transactionTypes = AllowanceRequiredTransactionTypes;
  fiatValue: string;
  allowance: AllowanceValidation;
  allowanceTransaction$ = new Subscription();
  latestSyncedBlock$: Subscription;
  percentageSelected: string;

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platformApi: PlatformApiService,
    protected _injector: Injector,
    private _blocksService: BlocksService
  ) {
    super(_injector);

    this.form = this._fb.group({
      amount: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]]
    });

    this.allowance$ = this.amount.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(amount => this.setFiatValue(amount)),
        switchMap((amount: string) => this.getAllowance$(amount)))
      .subscribe();

    this.latestSyncedBlock$ = this._blocksService.getLatestBlock$()
      .pipe(
        filter(_ => this.context?.wallet),
        switchMap(_ => this.getAllowance$()))
      .subscribe();
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  private setFiatValue(amount: string) {
    const lptFiat = new FixedDecimal(this.pool.token.lp.summary.priceUsd.toString(), 8);
    const amountDecimal = new FixedDecimal(amount, this.pool.token.lp.decimals);

    this.fiatValue = MathService.multiply(amountDecimal, lptFiat);
  }

  private getAllowance$(amount?: string) {
    amount = amount || this.amount.value;

    const spender = this.data?.pool?.summary?.miningPool?.address;
    const token = this.data?.pool?.token?.lp?.address;

    if (!amount) return of(null);

    return this._platformApi
      .getAllowance(this.context.wallet, spender, token)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, amount, this.data?.pool?.token?.lp)),
        tap(allowance => this.allowance = allowance));
  }

  submit(): void {
    let amount = this.amount.value.toString().replace(/,/g, '');
    if (!amount.includes('.')) amount = `${amount}.00`;

    const payload: IMiningQuote = {
      amount: amount
    }

    this._platformApi
      .startMiningQuote(this.pool.summary.miningPool.address, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote));
  }

  handlePercentageSelect(value: any) {
    this.percentageSelected = value.percentageOption;
    this.amount.setValue(value.result, {emitEvent: true});
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
    if (this.allowance$) this.allowance$.unsubscribe();
    if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
    if (this.latestSyncedBlock$) this.latestSyncedBlock$.unsubscribe();
  }
}
