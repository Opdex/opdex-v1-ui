import { MathService } from '@sharedServices/utility/math.service';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { environment } from '@environments/environment';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { ILiquidityPoolSummary } from '@sharedModels/responses/platform-api/liquidity-pools/liquidity-pool.interface';
import { switchMap, map, take, filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Icons } from 'src/app/enums/icons';
import { TransactionTypes } from 'src/app/enums/transaction-types';
import { ITransactionQuote } from '@sharedModels/responses/platform-api/transactions/transaction-quote.interface';
import { DecimalStringRegex } from '@sharedLookups/regex';

@Component({
  selector: 'opdex-tx-provide-remove',
  templateUrl: './tx-provide-remove.component.html',
  styleUrls: ['./tx-provide-remove.component.scss']
})
export class TxProvideRemoveComponent extends TxBase {
  @Input() pool: ILiquidityPoolSummary;
  icons = Icons;
  form: FormGroup;
  context: any;
  allowance$: Observable<AllowanceValidation>;
  transactionTypes = TransactionTypes;
  showMore: boolean = false;
  lptInFiatValue: string;
  lptInMinFiatValue: string;
  crsOutMin: string;
  srcOutMin: string;
  setTolerance = 0.1;

  get liquidity(): FormControl {
    return this.form.get('liquidity') as FormControl;
  }

  get deadline(): FormControl {
    return this.form.get('deadline') as FormControl;
  }

  get tolerance(): FormControl {
    return this.form.get('tolerance') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _dialog: MatDialog,
    private _platformApi: PlatformApiService,
    protected _userContext: UserContextService,
    protected _bottomSheet: MatBottomSheet,
    private _mathService: MathService
  ) {
    super(_userContext, _dialog, _bottomSheet);

    this.form = this._fb.group({
      liquidity: ['', [Validators.required, Validators.pattern(DecimalStringRegex)]],
      deadline: [''],
      tolerance: ['']
    });

    this.allowance$ = this.liquidity.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.calcTolerance()),
        filter(_ => this.context.wallet !== undefined),
        switchMap(amount => this.getAllowance$(amount)));
  }

  getAllowance$(amount: string):Observable<any> {
    const spender = environment.routerAddress;
    const token = this.pool?.token?.lp?.address;

    return this._platformApi
      .getAllowance(this.context.wallet, spender, token)
      .pipe(map(allowanceResponse => new AllowanceValidation(allowanceResponse, amount, this.pool.token.lp)));
  }

  submit(): void {
    let liquidity = this.liquidity.value.toString().replace(/,/g, '');
    if (!liquidity.includes('.')) liquidity = `${liquidity}.00`;

    const payload = {
      liquidity: liquidity,
      amountCrsMin: '0.00000001',
      amountSrcMin: '0.00000001',
      liquidityPool: this.pool.address,
      recipient: this.context.wallet
    };

    this._platformApi
      .removeLiquidityQuote(payload.liquidityPool, payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => {
          this.quote(quote);
        });
  }

  calcTolerance(tolerance?: number) {
    if (tolerance) this.setTolerance = tolerance;

    if (this.setTolerance > 99.99 || this.setTolerance < .01) return;
    if (!this.liquidity.value) return;

    this.lptInFiatValue = this._mathService.multiply(this.formatDecimalNumber(this.liquidity.value, this.pool.token.lp.decimals), this.pool.token.lp.summary.price.close as number);

    // 500 liquidity
    // 10000 total supply
    // 2500 crs
    // 5000 src
    // Write divide function math with tests
    // 500 / 10000 = 5%
    // 5% of 2500 = 125
    // 5% 0f 5000 = 250
  }

  private formatDecimalNumber(value: string, decimals: number): string {
    if (!value.includes('.')) value = `${value}.`.padEnd(value.length + 1 + decimals, '0');

    if (value.startsWith('.')) value = `0${value}`;

    var parts = value.split('.');

    return `${parts[0]}.${parts[1].padEnd(decimals, '0')}`;
  }

  toggleShowMore(value: boolean) {
    this.showMore = value;
  }

  calcDeadline(minutes: number) {

  }
}
