import { ILiquidityPoolResponse } from '@sharedModels/platform-api/responses/liquidity-pools/liquidity-pool-responses.interface';
import { VaultsService } from '@sharedServices/platform/vaults.service';
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
import { AllowanceValidation } from '@sharedModels/allowance-validation';
import { UserContext } from '@sharedModels/user-context';

export abstract class TxBase {
  context: UserContext;
  context$: Subscription;
  quoteErrors: string[] = [];

  private _userContext: UserContextService;
  private _bottomSheet: MatBottomSheet;
  private _walletsService: WalletsService;
  protected _vaultsService: VaultsService;

  constructor(
    protected _injector: Injector
  ) {
    this._userContext = this._injector.get(UserContextService);
    this._bottomSheet = this._injector.get(MatBottomSheet);
    this._walletsService = this._injector.get(WalletsService);
    this._vaultsService = this._injector.get(VaultsService);
    this.context$ = this._userContext.getUserContext$().subscribe(context => this.context = context);
  }

  quote(quote: ITransactionQuote): void {
    this.quoteErrors = [];
    this._bottomSheet.open(ReviewQuoteComponent, { data: quote });
  }

  protected _validateAllowance$(owner: string, spender: string, token: IToken, amount: string): Observable<AllowanceValidation> {
    if (!owner || !spender || !token || !amount) return of(null);

    const amountToSpend = new FixedDecimal(amount, token.decimals);

    return this._walletsService
      .getAllowance(owner, spender, token.address)
      .pipe(
        map(allowanceResponse => new AllowanceValidation(allowanceResponse, amountToSpend.formattedValue, token)),
        catchError(_ => of(null)));
  }

  protected _validateBalance$(token: IToken, amountToSpend: FixedDecimal): Observable<boolean> {
    if (!token) return of(false);
    if (amountToSpend.bigInt === BigInt(0)) return of(true);

    return this._walletsService.getBalance(this.context.wallet, token.address)
      .pipe(
        map(balance => this._isEnough(new FixedDecimal(balance.balance, token.decimals), amountToSpend)),
        catchError(_ => of(false)));
  }

  protected _validateStakingBalance$(liquidityPool: ILiquidityPoolResponse, amountToSpend: FixedDecimal): Observable<boolean> {
    if (!liquidityPool) return of(false);

    return this._walletsService.getStakingPosition(this.context.wallet, liquidityPool.address)
      .pipe(
        map(position => this._isEnough(new FixedDecimal(position.amount, liquidityPool.summary.staking.token.decimals), amountToSpend)),
        catchError(_ => of(false)));
  }

  protected _validateMiningBalance$(liquidityPool: ILiquidityPoolResponse, amountToSpend: FixedDecimal): Observable<boolean> {
    if (!liquidityPool) return of(false);

    return this._walletsService.getMiningPosition(this.context.wallet, liquidityPool.miningPool.address)
      .pipe(
        map(position => this._isEnough(new FixedDecimal(position.amount, liquidityPool.tokens.lp.decimals), amountToSpend)),
        catchError(_ => of(false)));
  }

  protected _validateVaultPledge$(proposalId: number, amountToSpend: FixedDecimal): Observable<boolean> {
    if (amountToSpend.bigInt === BigInt(0)) return of(true);

    return this._vaultsService.getPledge(proposalId, this.context.wallet)
      .pipe(
        map(pledge => this._isEnough(new FixedDecimal(pledge.balance, 8), amountToSpend)),
        catchError(_ => of(false)));
  }

  protected _validateVaultVote$(proposalId: number, amountToSpend: FixedDecimal): Observable<boolean> {
    if (amountToSpend.bigInt === BigInt(0)) return of(true);

    return this._vaultsService.getVote(proposalId, this.context.wallet)
      .pipe(
        map(vote => this._isEnough(new FixedDecimal(vote.balance, 8), amountToSpend)),
        catchError(_ => of(false)));
  }

  private _isEnough(actualAmount: FixedDecimal, neededAmount: FixedDecimal) {
    // If the necessary amount is 0 but this is still being called, we're checking to make sure they have a balance in general
    if (neededAmount.bigInt === BigInt(0)) {
      return !actualAmount.isZero;
    }

    return actualAmount.bigInt >= neededAmount.bigInt;
  }

  /**
   * @summary Force the implementation of unsubscribing from the context$ stream.
   * In good faith, hoping, developers implement the method correctly, and execute it
   * during OnDestroy
   */
  abstract destroyContext$(): void;
}
