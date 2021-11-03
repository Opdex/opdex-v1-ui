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
import { CreateLiquidityPoolRequest, ICreateLiquidityPoolRequest } from '@sharedModels/platform-api/requests/liquidity-pools/create-liquidity-pool-request';
import { TokensService } from '@sharedServices/platform/tokens.service';
import { AddTokenRequest, IAddTokenRequest } from '@sharedModels/platform-api/requests/tokens/add-token-request';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { IconSizes } from 'src/app/enums/icon-sizes';

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
  validatedToken: IToken = null;
  context: any;

  get token(): FormControl {
    return this.form.get('token') as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _platform: PlatformApiService,
    protected _injector: Injector,
    private _tokensService: TokensService
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
    const payload: ICreateLiquidityPoolRequest = new CreateLiquidityPoolRequest({
      token: this.token.value
    });

    if(payload.isValid && this.isTokenKnown){
      this._platform
        .createLiquidityPool(payload)
          .pipe(take(1))
          .subscribe((quote: ITransactionQuote) => this.quote(quote));
    } else if (payload.isValid && !this.isTokenKnown) {
      this.validateToken();
    }
  }

  validateToken(): void{
    const payload: IAddTokenRequest = new AddTokenRequest({
      tokenAddress: this.token.value
    });

    if (payload.isValid) {
      this._platform.addToken(payload)
      .pipe(
        catchError(_ => of(null)),
        take(1))
      .subscribe((token: IToken) => {
        if(!token){
          this.isValidToken = false;
        } else {
          this.isTokenKnown = true;
          this.isValidToken = true;
          this.validatedToken = token;
        }
      });
    }
  }

  destroyContext$() {
    this.context$.unsubscribe();
  }

  ngOnDestroy() {
    this.destroyContext$();
    this.subscription.unsubscribe();
  }
}
