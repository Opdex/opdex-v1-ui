import { TokensService } from '@sharedServices/platform/tokens.service';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { Injector } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { TxBase } from '../tx-base.component';
import { Icons } from 'src/app/enums/icons';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { switchMap, take } from 'rxjs/operators';
import { PositiveDecimalNumberRegex } from '@sharedLookups/regex';
import { ApproveAllowanceRequest } from '@sharedModels/platform-api/requests/tokens/approve-allowance-request';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';

@Component({
  selector: 'opdex-tx-allowance',
  templateUrl: './tx-allowance.component.html',
  styleUrls: ['./tx-allowance.component.scss']
})
export class TxAllowanceComponent extends TxBase {
  @Input() data: any;
  icons = Icons;
  pool: ILiquidityPoolResponse;
  txHash: string;
  form: FormGroup;

  get token(): FormControl {
    return this.form.get('token') as FormControl;
  }

  get spender(): FormControl {
    return this.form.get('spender') as FormControl;
  }

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    protected _injector: Injector,
    private _platformApiService: PlatformApiService,
    private _tokenService: TokensService
  ) {
    super(_injector);

    this.form = this._fb.group({
      token: ['', [Validators.required]],
      spender: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(PositiveDecimalNumberRegex)]],
    });
  }

  submit() {
    this._tokenService.getToken(this.token.value)
      .pipe(
        switchMap(token => {
          const request = new ApproveAllowanceRequest(new FixedDecimal(this.amount.value, token.decimals), this.spender.value);
          return this._platformApiService.approveAllowanceQuote(this.token.value, request.payload);
        }),
        take(1))
      .subscribe((quote: ITransactionQuote) => this.quote(quote),
                 (errors: string[]) => this.quoteErrors = errors);
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
  }
}
