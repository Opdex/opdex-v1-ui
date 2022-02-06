import { EnvironmentsService } from '@sharedServices/utility/environments.service';
import { TxBase } from '@sharedComponents/tx-module/tx-base.component';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { catchError, distinctUntilChanged, switchMap, take} from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
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
import { UserContext } from '@sharedModels/user-context';
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
  txHash: string;
  token$: Observable<string>;
  subscription: Subscription = new Subscription();
  isTokenKnown: boolean;
  isValidToken: boolean;
  validatedToken: Token = null;
  context: UserContext;

  get token(): FormControl {
    return this.form.get('token') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platform: PlatformApiService,
    protected _injector: Injector,
    private _tokensService: TokensService,
    private _env: EnvironmentsService
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
          switchMap((value: string) => this._tokensService.getToken(value).pipe(catchError(_ => of(null)))),
        ).subscribe(token => {
          if (!token) {
            this.isTokenKnown = false;
          } else {
            this.isTokenKnown = true;
            this.isValidToken = true;
            this.validatedToken = token;
          }
        })
    )
  }

  submit() {
    const request = new CreateLiquidityPoolRequest(this.token.value, this._env.marketAddress);

    if (!this.isTokenKnown) {
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
        catchError(_ => of(null)),
        take(1))
      .subscribe((token: Token) => {
        if(!token){
          this.isValidToken = false;
        } else {
          this.isTokenKnown = true;
          this.isValidToken = true;
          this.validatedToken = token;
        }
      },
      (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
    this.subscription.unsubscribe();
  }
}
