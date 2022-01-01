import { VaultGovernancesService } from '@sharedServices/platform/vault-governances.service';
import { IToken } from '@sharedModels/platform-api/responses/tokens/token.interface';
import { WalletsService } from '@sharedServices/platform/wallets.service';
import { Injector } from '@angular/core';
import { ReviewQuoteComponent } from './shared/review-quote/review-quote.component';
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { UserContextService } from "@sharedServices/utility/user-context.service";
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { Observable, of, Subscription } from 'rxjs';
import { FixedDecimal } from '@sharedModels/types/fixed-decimal';
import { catchError, map } from 'rxjs/operators';

export abstract class TxBase{
  context: any;
  context$: Subscription;
  quoteErrors: string[] = [];

  private _userContext: UserContextService;
  private _bottomSheet: MatBottomSheet;
  private _walletsService: WalletsService;
  protected _vaultsService: VaultGovernancesService;

  constructor(
    protected _injector: Injector
  ) {
    this._userContext = this._injector.get(UserContextService);
    this._bottomSheet = this._injector.get(MatBottomSheet);
    this._walletsService = this._injector.get(WalletsService);
    this._vaultsService = this._injector.get(VaultGovernancesService);
    this.context$ = this._userContext.getUserContext$().subscribe(context => this.context = context);
  }

  quote(quote: ITransactionQuote): void {
    this.quoteErrors = [];
    this._bottomSheet.open(ReviewQuoteComponent, { data: quote });
  }

  protected _validateBalance$(token: IToken, amountToSpend: FixedDecimal): Observable<boolean> {
    if (!token) return of(false);
    if (amountToSpend.bigInt === BigInt(0)) return of(true);

    return this._walletsService.getBalance(this.context.wallet, token.address)
      .pipe(
        map(balance => {
          const fixedBalance = new FixedDecimal(balance.balance, token.decimals);
          return fixedBalance.bigInt >= amountToSpend.bigInt;
        }),
        catchError(_ => of(false)));
  }

  protected _validateVaultPledge$(proposalId: number, amountToSpend: FixedDecimal): Observable<boolean> {
    if (amountToSpend.bigInt === BigInt(0)) return of(true);

    return this._vaultsService.getPledge(proposalId, this.context.wallet)
      .pipe(
        map(pledge => {
          const fixedPledge = new FixedDecimal(pledge.balance, 8);
          return fixedPledge.bigInt >= amountToSpend.bigInt;
        }),
        catchError(_ => of(false)));
  }

  protected _validateVaultVote$(proposalId: number, amountToSpend: FixedDecimal): Observable<boolean> {
    if (amountToSpend.bigInt === BigInt(0)) return of(true);

    return this._vaultsService.getVote(proposalId, this.context.wallet)
      .pipe(
        map(vote => {
          const fixedVote = new FixedDecimal(vote.balance, 8);
          return fixedVote.bigInt >= amountToSpend.bigInt;
        }),
        catchError(_ => of(false)));
  }

  /**
   * @summary Force the implementation of unsubscribing from the context$ stream.
   * In good faith, hoping, developers implement the method correctly, and execute it
   * during OnDestroy
   */
  abstract destroyContext$(): void;
}
