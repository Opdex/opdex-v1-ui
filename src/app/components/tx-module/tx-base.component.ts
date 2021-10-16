import { Injector } from '@angular/core';
import { ReviewQuoteComponent } from './shared/review-quote/review-quote.component';
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { UserContextService } from "@sharedServices/utility/user-context.service";
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { Subscription } from 'rxjs';

export abstract class TxBase{
  context: any;
  context$: Subscription;

  private _userContext: UserContextService;
  private _bottomSheet: MatBottomSheet;

  constructor(
    protected _injector: Injector
  ) {
    this._userContext = this._injector.get(UserContextService);
    this._bottomSheet = this._injector.get(MatBottomSheet);
    this.context$ = this._userContext.getUserContext$().subscribe(context => this.context = context);
  }

  quote(quote: ITransactionQuote) {
    this._bottomSheet.open(ReviewQuoteComponent, {
      data: quote
    });
  }

  /**
   * @summary Force the implementation of unsubscribing from the context$ stream.
   * In good faith, hoping, developers implement the method correctly, and execute it
   * during OnDestroy
   */
  abstract destroyContext$(): void;
}
