import { BlocksService } from '@sharedServices/platform/blocks.service';
import { MathService } from '@sharedServices/utility/math.service';
import { Component, Input, OnChanges, Injector } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { DecimalStringRegex } from '@sharedLookups/regex';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { ILiquidityPoolSummary } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool.interface';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap, map, take, distinctUntilChanged, filter } from 'rxjs/operators';
import { Icons } from 'src/app/enums/icons';
import { IStartStakingRequest } from '@sharedModels/platform-api/requests/liquidity-pools/start-staking-request';
import { AllowanceRequiredTransactionTypes } from 'src/app/enums/allowance-required-transaction-types';

@Component({
  selector: 'opdex-tx-stake-start',
  templateUrl: './tx-stake-start.component.html',
  styleUrls: ['./tx-stake-start.component.scss']
})
export class TxStakeStartComponent extends TxBase implements OnChanges {
  @Input() data;
  icons = Icons;
  form: FormGroup;
  pool: ILiquidityPoolSummary;
  allowance$: Subscription;
  transactionTypes = AllowanceRequiredTransactionTypes;
  fiatValue: string;
  allowance: AllowanceValidation;
  allowanceTransaction$ = new Subscription();
  latestSyncedBlock$: Subscription;

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

    this.latestSyncedBlock$ = this._blocksService.getLatestBlock$()
      .pipe(
        filter(_ => this.context?.wallet),
        switchMap(_ => this.getAllowance$()))
      .subscribe();

    this.allowance$ = this.amount.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(amount => this.setFiatValue(amount)),
        switchMap((amount: string) => this.getAllowance$(amount)))
      .subscribe();
  }

  ngOnChanges(): void {
    this.pool = this.data?.pool;
  }

  private setFiatValue(amount: string) {
    const stakingTokenFiat = new FixedDecimal(this.pool.token.staking.summary.price.close.toString(), 8);
    const amountDecimal = new FixedDecimal(amount, this.pool.token.staking.decimals);

    this.fiatValue = MathService.multiply(amountDecimal, stakingTokenFiat);
  }

  private getAllowance$(amount?: string): Observable<AllowanceValidation> {
    amount = amount || this.amount.value;

    const spender = this.data?.pool?.address;
    const token = this.data?.pool?.token?.staking?.address;

    if (!amount) return of(null);

    return this._platformApi
      .getAllowance(this.context.wallet, spender, token)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, amount, this.data.pool.token.staking)),
        tap(allowance => this.allowance = allowance));
  }

  submit(): void {
    let amount = this.amount.value.toString().replace(/,/g, '');
    if (!amount.includes('.')) amount = `${amount}.00`;

    const payload: IStartStakingRequest = {
      amount: amount
    }

    this._platformApi
      .startStakingQuote(this.pool.address, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote));
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
    if (this.allowance$) this.allowance$.unsubscribe();
    if (this.latestSyncedBlock$) this.latestSyncedBlock$.unsubscribe();
    if (this.allowanceTransaction$) this.allowanceTransaction$.unsubscribe();
  }
}
