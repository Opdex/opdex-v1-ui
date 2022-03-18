import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PlatformApiService } from '@sharedServices/api/platform-api.service';
import { UserContext } from '@sharedModels/user-context';
import { UserContextService } from '@sharedServices/utility/user-context.service';
import { IndexService } from '@sharedServices/platform/index.service';
import { Icons } from 'src/app/enums/icons';
import { Subscription } from 'rxjs';
import { Token } from '@sharedModels/ui/tokens/token';
import { Component, Input, OnDestroy } from '@angular/core';
import { ReviewQuoteComponent } from '@sharedComponents/tx-module/shared/review-quote/review-quote.component';
import { OpdexHttpError } from '@sharedModels/errors/opdex-http-error';
import { ITransactionQuote } from '@sharedModels/platform-api/responses/transactions/transaction-quote.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'opdex-token-summary-card',
  templateUrl: './token-summary-card.component.html',
  styleUrls: ['./token-summary-card.component.scss']
})
export class TokenSummaryCardComponent implements OnDestroy {
  @Input() token: Token;
  @Input() showTokenName: boolean;
  latestBlock: number;
  context: UserContext;
  quoteErrors: string[];
  subscription = new Subscription();
  icons = Icons;

  constructor(
    private _indexService: IndexService,
    private _userContextService: UserContextService,
    private _platformApiService: PlatformApiService,
    private _bottomSheet: MatBottomSheet
  ) {
    this.subscription.add(
      this._indexService.latestBlock$
        .subscribe(block => this.latestBlock = block.height));

    this.subscription.add(
      this._userContextService.getUserContext$()
        .subscribe(context => this.context = context));
  }

  distribute(): void {
    if (!this.context?.wallet || !this.token) return;

    this._platformApiService.distributeTokensQuote(this.token.address)
      .pipe(take(1))
      .subscribe((quote: ITransactionQuote) => this._bottomSheet.open(ReviewQuoteComponent, { data: quote }),
                 (error: OpdexHttpError) => this.quoteErrors = error.errors);
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
