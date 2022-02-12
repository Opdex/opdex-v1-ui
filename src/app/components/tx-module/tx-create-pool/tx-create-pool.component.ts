import { LiquidityPool } from '@sharedModels/ui/liquidity-pools/liquidity-pool';
import { LiquidityPoolsFilter } from '@sharedModels/platform-api/requests/liquidity-pools/liquidity-pool-filter';
import { LiquidityPoolsService } from '@sharedServices/platform/liquidity-pools.service';
import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { distinctUntilChanged, map, switchMap, take, catchError, tap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { Component, Input, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TransactionView } from '@sharedModels/transaction-view';
import { Icons } from 'src/app/enums/icons';
import { debounceTime } from 'rxjs/operators';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { CreateLiquidityPoolRequest } from '@sharedModels/platform-api/requests/liquidity-pools/create-liquidity-pool-request';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { AddTokenRequest } from '@sharedModels/platform-api/requests/tokens/add-token-request';
import { IconSizes } from 'src/app/enums/icon-sizes';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';
import { Token } from '@sharedModels/ui/tokens/token';

@Component({
  selector: 'opdex-tx-create-pool',
  templateUrl: './tx-create-pool.component.html',
  styleUrls: ['./tx-create-pool.component.scss']
})
export class TxCreatePoolComponent extends TxBase {
  @Input() data: any;
  view = TransactionView.createPool;
  form: FormGroup;
  icons = Icons;
  iconSizes = IconSizes;
  subscription = new Subscription();
  validatedToken: Token = null;
  validatedTokenPool: LiquidityPool = null;

  get token(): FormControl {
    return this.form.get('token') as FormControl;
  }

  get isTokenValid(): boolean {
    return this.validatedToken && !this.validatedToken.attributes.includes('Provisional');
  }

  constructor(
    private _fb: FormBuilder,
    private _platform: PlatformApiService,
    protected _injector: Injector,
    private _tokensService: TokensService,
    private _env: EnvironmentsService,
    private _liquidityPoolsService: LiquidityPoolsService
  ) {
    super(_injector);

    this.form = this._fb.group({
      token: ['', [Validators.required]]
    });

    this.subscription.add(
      this.token.valueChanges
        .pipe(
          distinctUntilChanged(),
          debounceTime(400),
          switchMap((value: string) => {
            return this._tokensService.getToken(value)
              .pipe(
                tap(token => this._validateToken(token, null)),
                catchError((error: OpdexHttpError) => {
                  this._validateToken(null, error.status === 404 ? null : error.errors);
                  return of(null);
                }))
        }))
        .subscribe());
  }

  submit() {
    const request = new CreateLiquidityPoolRequest(this.token.value, this._env.marketAddress);

    if (!this.validatedToken) {
      this.validateToken();
      return;
    }

    this._platform
      .createLiquidityPool(request.payload)
        .pipe(take(1))
        .subscribe((quote: ITransactionQuote) => this.quote(quote),
                   (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  validateToken(): void{
    const request = new AddTokenRequest(this.token.value);

    this._platform.addToken(request.payload)
      .pipe(
        // return token or fetch token - token already exists vs 201 created
        switchMap((token: Token) => !!token ? of(token) : this._tokensService.getToken(this.token.value)),
        take(1))
      .subscribe((token: Token) => this._validateToken(token, null),
                 (error: OpdexHttpError) => this._validateToken(null, error.errors));
  }

  private _validateToken(token: Token, errors: string[]) {
    if (token && !errors) {
      const filter = new LiquidityPoolsFilter({
        markets: [this._env.marketAddress],
        tokens: [token.address],
        limit: 1
      });

      this._liquidityPoolsService.getLiquidityPools(filter)
        .pipe(
          take(1),
          map(results => results.results[0]))
        .subscribe(pool => this._setValidations(token, pool, null));
    } else {
      this._setValidations(null, null, errors)
    }
  }

  private _setValidations(token: Token, pool: LiquidityPool, errors: string[]): void {
    this.validatedToken = token;
    this.validatedTokenPool = pool;
    this.quoteErrors = errors;
  }

  destroyContext$(): void {
    this.context$.unsubscribe();
  }

  ngOnDestroy(): void {
    this.destroyContext$();
    this.subscription.unsubscribe();
  }
}
